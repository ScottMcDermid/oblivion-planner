/**
 * Build Codec — encodes/decodes the full character build state into a compact,
 * URL-safe string using binary packing + lz-string compression.
 *
 * Encoding format (v1):
 *   Byte 0: version (1)
 *   Then bit-packed fields:
 *     - remastered: 1 bit
 *     - race: 4 bits (index into races array, 10 values)
 *     - gender: 1 bit (index into genders array)
 *     - birthsign: 4 bits (index into birthsigns array, 13 values)
 *     - specialization: 2 bits (index, 3 values)
 *     - favoredAttributes: 2x 3 bits (index into attributes array, 8 values)
 *     - majorSkills: 7x 5 bits (index into skills array, 21 values)
 *     - activeAbilities: 11-bit bitmask (index into ABILITIES_LIST)
 *   Then per levelUp (count encoded as 6 bits, max 63):
 *     - attributes: 8x 3 bits (values 0-5, stored as-is; Luck is 0-1)
 *     - skills: 21-bit bitmask (which skills are non-zero)
 *       then for each set bit: 4 bits (value 1-15)
 */

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

import races, { type Race } from '@/utils/raceUtils';
import genders, { type Gender } from '@/utils/genderUtils';
import birthsigns, { type Birthsign } from '@/utils/birthsignUtils';
import specializations, { type Specialization } from '@/utils/specializationUtils';
import attributes, { type Attribute } from '@/utils/attributeUtils';
import skills, { getSkillsSetTemplate, type Skill, type SkillsSet } from '@/utils/skillUtils';
import { getAttributesSetTemplate, type AttributesSet } from '@/utils/attributeUtils';
import type { LevelUp } from '@/utils/levelUtils';
import type { AbilityName } from '@/utils/abilityUtils';

// Canonical ordering for abilities bitmask
const ABILITIES_LIST: AbilityName[] = [
  'Skeleton Key',
  "Gray Prince's Training",
  "Night Mother's Blessing",
  'Vampirism (Stage 1)',
  'Vampirism (Stage 2)',
  'Vampirism (Stage 3)',
  'Vampirism (Stage 4)',
  'Dwemer Fireheart',
  'Alchemical Brilliance',
  "Crusader's Arm (Sword)",
  "Crusader's Arm (Mace)",
];

const CODEC_VERSION = 1;

// ─── Bit Writer / Reader ────────────────────────────────────────────────────

class BitWriter {
  private buffer: number[] = [];
  private currentByte = 0;
  private bitPos = 0; // next bit position in currentByte (0-7, MSB first)

  writeBits(value: number, numBits: number): void {
    for (let i = numBits - 1; i >= 0; i--) {
      const bit = (value >> i) & 1;
      this.currentByte = (this.currentByte << 1) | bit;
      this.bitPos++;
      if (this.bitPos === 8) {
        this.buffer.push(this.currentByte);
        this.currentByte = 0;
        this.bitPos = 0;
      }
    }
  }

  toUint8Array(): Uint8Array {
    // Flush remaining bits (pad with zeros on the right)
    const result = [...this.buffer];
    if (this.bitPos > 0) {
      result.push(this.currentByte << (8 - this.bitPos));
    }
    return new Uint8Array(result);
  }
}

class BitReader {
  private data: Uint8Array;
  private bytePos = 0;
  private bitPos = 0; // next bit position in current byte (0-7, MSB first)

  constructor(data: Uint8Array) {
    this.data = data;
  }

  readBits(numBits: number): number {
    let value = 0;
    for (let i = 0; i < numBits; i++) {
      const byte = this.data[this.bytePos];
      const bit = (byte >> (7 - this.bitPos)) & 1;
      value = (value << 1) | bit;
      this.bitPos++;
      if (this.bitPos === 8) {
        this.bytePos++;
        this.bitPos = 0;
      }
    }
    return value;
  }
}

// ─── Encode ─────────────────────────────────────────────────────────────────

export interface BuildData {
  remastered: boolean;
  race: Race;
  gender: Gender;
  birthsign: Birthsign;
  specialization: Specialization;
  favoredAttributes: Attribute[];
  majorSkills: Skill[];
  activeAbilities: AbilityName[];
  levelUps: LevelUp[];
}

export function encodeBuild(data: BuildData): string {
  const writer = new BitWriter();

  // Version byte (8 bits)
  writer.writeBits(CODEC_VERSION, 8);

  // Remastered (1 bit)
  writer.writeBits(data.remastered ? 1 : 0, 1);

  // Race (4 bits)
  writer.writeBits(races.indexOf(data.race), 4);

  // Gender (1 bit)
  writer.writeBits(genders.indexOf(data.gender), 1);

  // Birthsign (4 bits)
  writer.writeBits(birthsigns.indexOf(data.birthsign), 4);

  // Specialization (2 bits)
  writer.writeBits(specializations.indexOf(data.specialization), 2);

  // Favored Attributes (2x 3 bits)
  for (const attr of data.favoredAttributes) {
    writer.writeBits(attributes.indexOf(attr), 3);
  }

  // Major Skills (7x 5 bits)
  for (const skill of data.majorSkills) {
    writer.writeBits(skills.indexOf(skill), 5);
  }

  // Active Abilities (11-bit bitmask)
  let abilityMask = 0;
  for (const ability of data.activeAbilities) {
    const idx = ABILITIES_LIST.indexOf(ability);
    if (idx >= 0) abilityMask |= 1 << idx;
  }
  writer.writeBits(abilityMask, 11);

  // Number of levelUps (6 bits, max 63)
  const numLevelUps = Math.min(data.levelUps.length, 63);
  writer.writeBits(numLevelUps, 6);

  // Each LevelUp
  for (let i = 0; i < numLevelUps; i++) {
    const levelUp = data.levelUps[i];

    // Attributes: 8x 3 bits (values 0-5, fits in 3 bits)
    for (const attr of attributes) {
      writer.writeBits(levelUp.attributes[attr] & 0x7, 3);
    }

    // Skills: 21-bit bitmask + 4 bits per non-zero skill
    let skillMask = 0;
    for (let s = 0; s < skills.length; s++) {
      if (levelUp.skills[skills[s]] > 0) {
        skillMask |= 1 << s;
      }
    }
    writer.writeBits(skillMask >>> 16, 5); // top 5 bits (bits 20-16)
    writer.writeBits(skillMask & 0xffff, 16); // bottom 16 bits

    // Write values for non-zero skills
    for (let s = 0; s < skills.length; s++) {
      if (skillMask & (1 << s)) {
        // Skill values in a single levelup are typically 1-15, clamp to 4 bits
        const val = Math.min(levelUp.skills[skills[s]], 15);
        writer.writeBits(val, 4);
      }
    }
  }

  // Convert to binary string and compress
  const bytes = writer.toUint8Array();
  const binaryString = String.fromCharCode.apply(null, Array.from(bytes));
  return compressToEncodedURIComponent(binaryString);
}

// ─── Decode ─────────────────────────────────────────────────────────────────

export function decodeBuild(code: string): BuildData | null {
  try {
    const binaryString = decompressFromEncodedURIComponent(code);
    if (!binaryString) return null;

    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const reader = new BitReader(bytes);

    // Version
    const version = reader.readBits(8);
    if (version !== CODEC_VERSION) return null;

    // Remastered
    const remastered = reader.readBits(1) === 1;

    // Race
    const raceIdx = reader.readBits(4);
    const race = races[raceIdx];
    if (!race) return null;

    // Gender
    const genderIdx = reader.readBits(1);
    const gender = genders[genderIdx];
    if (!gender) return null;

    // Birthsign
    const birthsignIdx = reader.readBits(4);
    const birthsign = birthsigns[birthsignIdx];
    if (!birthsign) return null;

    // Specialization
    const specIdx = reader.readBits(2);
    const specialization = specializations[specIdx];
    if (!specialization) return null;

    // Favored Attributes
    const favoredAttributes: Attribute[] = [];
    for (let i = 0; i < 2; i++) {
      const idx = reader.readBits(3);
      favoredAttributes.push(attributes[idx]);
    }

    // Major Skills
    const majorSkills: Skill[] = [];
    for (let i = 0; i < 7; i++) {
      const idx = reader.readBits(5);
      majorSkills.push(skills[idx]);
    }

    // Active Abilities
    const abilityMask = reader.readBits(11);
    const activeAbilities: AbilityName[] = [];
    for (let i = 0; i < ABILITIES_LIST.length; i++) {
      if (abilityMask & (1 << i)) {
        activeAbilities.push(ABILITIES_LIST[i]);
      }
    }

    // LevelUps
    const numLevelUps = reader.readBits(6);
    const levelUps: LevelUp[] = [];

    for (let i = 0; i < numLevelUps; i++) {
      // Attributes
      const levelUpAttributes: AttributesSet = getAttributesSetTemplate();
      for (const attr of attributes) {
        levelUpAttributes[attr] = reader.readBits(3);
      }

      // Skills bitmask (21 bits)
      const skillMaskHigh = reader.readBits(5);
      const skillMaskLow = reader.readBits(16);
      const skillMask = (skillMaskHigh << 16) | skillMaskLow;

      const levelUpSkills: SkillsSet = getSkillsSetTemplate();
      for (let s = 0; s < skills.length; s++) {
        if (skillMask & (1 << s)) {
          levelUpSkills[skills[s]] = reader.readBits(4);
        }
      }

      levelUps.push({ attributes: levelUpAttributes, skills: levelUpSkills });
    }

    return {
      remastered,
      race,
      gender,
      birthsign,
      specialization,
      favoredAttributes,
      majorSkills,
      activeAbilities,
      levelUps,
    };
  } catch {
    return null;
  }
}
