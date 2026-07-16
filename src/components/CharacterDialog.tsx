'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Drawer,
  IconButton,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DeleteIcon from '@mui/icons-material/Delete';

import type { Attribute } from '@/utils/attributeUtils';
import type { Birthsign } from '@/utils/birthsignUtils';
import type { Gender, LocationOrigin } from '@/utils/genderUtils';
import type { Race } from '@/utils/raceUtils';
import type { Skill } from '@/utils/skillUtils';
import type { Specialization } from '@/utils/specializationUtils';

import DropDown from '@/components/DropDown';
import { Panel, PanelHeader } from '@/components/Panel';

import { useCharacterStore } from '@/data/characterStore';

import attributes, {
  skillsByAttribute,
  NUM_FAVORED_ATTRIBUTES,
  shorthandByAttribute,
} from '@/utils/attributeUtils';
import specializations from '@/utils/specializationUtils';
import races, { locationOriginByRaceAndGender, locationOriginsByRace } from '@/utils/raceUtils';
import genders, { genderByLocationOrigin } from '@/utils/genderUtils';
import birthsigns from '@/utils/birthsignUtils';
import { NUM_MAJOR_SKILLS, shorthandBySkill } from '@/utils/skillUtils';
import ToggleButtons from '@/components/ToggleButtons';
import SkillIcon from '@/components/SkillIcon';
import { GiCrossedSwords, GiSpellBook, GiRogue } from 'react-icons/gi';

export const CHARACTER_DRAWER_WIDTH = 420;

const specializationIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  Combat: GiCrossedSwords,
  Magic: GiSpellBook,
  Stealth: GiRogue,
};


function CharacterContent({
  remastered,
  onClose,
  isDrawer,
}: {
  remastered: boolean;
  onClose?: () => void;
  isDrawer?: boolean;
}) {
  const {
    characterName,
    race,
    gender,
    birthsign,
    specialization,
    favoredAttributes,
    majorSkills,
    actions: { setCharacterData },
  } = useCharacterStore();

  const favoredAttributesError = useMemo(() => {
    if (favoredAttributes.length !== NUM_FAVORED_ATTRIBUTES) {
      return `Choose exactly ${NUM_FAVORED_ATTRIBUTES} favored attributes`;
    }
    return '';
  }, [favoredAttributes]);

  const majorSkillsError = useMemo(() => {
    if (majorSkills.length !== NUM_MAJOR_SKILLS) {
      return `Choose exactly ${NUM_MAJOR_SKILLS} major skills`;
    }
    return '';
  }, [majorSkills]);

  const handleToggleFavoredAttribute = (attribute: Attribute) => {
    const newFavoredAttributes = [...favoredAttributes];
    const idx = newFavoredAttributes.indexOf(attribute);
    if (idx === -1) newFavoredAttributes.push(attribute);
    else newFavoredAttributes.splice(idx, 1);
    setCharacterData({ favoredAttributes: newFavoredAttributes });
  };

  const handleToggleMajorSkill = (skill: Skill) => {
    const newMajorSkills = [...majorSkills];
    const idx = newMajorSkills.indexOf(skill);
    if (idx === -1) newMajorSkills.push(skill);
    else newMajorSkills.splice(idx, 1);
    setCharacterData({ majorSkills: newMajorSkills });
  };

  return (
    <>
      {/* Character panel */}
      <Panel>
        <PanelHeader
          label={characterName || 'Character'}
          action={
            isDrawer && onClose ? (
              <IconButton size="small" aria-label="close" onClick={onClose}>
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
            ) : undefined
          }
        />
        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            label="Name"
            placeholder="e.g. Hero of Kvatch"
            value={characterName ?? ''}
            onChange={(e) => setCharacterData({ characterName: e.target.value.slice(0, 255) })}
            variant="outlined"
            size="small"
            fullWidth
            slotProps={{ htmlInput: { maxLength: 255 } }}
          />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <DropDown
                label="Race"
                value={race}
                options={races}
                onChangeHandler={(race) => setCharacterData({ race: race as Race })}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              {remastered ? (
                <DropDown
                  label="Origin"
                  value={locationOriginByRaceAndGender[race][gender]}
                  options={locationOriginsByRace[race]}
                  onChangeHandler={(locationOrigin) =>
                    setCharacterData({ gender: genderByLocationOrigin[locationOrigin as LocationOrigin] })
                  }
                />
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', pl: 0.5 }}>
                    Gender
                  </Typography>
                  <ToggleButtons
                    name="Gender"
                    value={gender}
                    options={genders}
                    onChangeHandler={(gender) => setCharacterData({ gender: gender as Gender })}
                  />
                </Box>
              )}
            </Box>
          </Box>
          <DropDown
            label="Birthsign"
            value={birthsign}
            options={birthsigns}
            onChangeHandler={(birthsign) => setCharacterData({ birthsign: birthsign as Birthsign })}
          />
        </Box>
      </Panel>

      {/* Class panel */}
      <Panel>
        <PanelHeader label="Class" />
        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', pl: 0.5 }}>
              Specialization
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={specialization}
              onChange={(_e, val) => { if (val) setCharacterData({ specialization: val as Specialization }); }}
              sx={{ width: '100%' }}
            >
              {specializations.map((spec) => {
                const Icon = specializationIcons[spec];
                return (
                  <ToggleButton key={spec} value={spec} sx={{ flex: 1, gap: 0.75, py: 0.5, fontSize: '0.75rem' }}>
                    <Icon size={14} />
                    {spec}
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', pt: 0.5 }}>
            Choose 2 favored attributes and 7 major skills
          </Typography>
          <div className="grid grid-cols-[2.5rem_1fr_3fr] place-items-center gap-y-0.5">
            <div />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>Favored</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', justifySelf: 'start', pl: 1 }}>Skills</Typography>
            {attributes.map((attribute) => (
              <React.Fragment key={attribute}>
                <Typography variant="caption" sx={{ textAlign: 'right', width: '100%', color: 'text.primary', fontSize: '0.7rem' }}>
                  {shorthandByAttribute[attribute]}
                </Typography>
                <Checkbox
                  size="small"
                  checked={favoredAttributes.includes(attribute)}
                  onChange={() => handleToggleFavoredAttribute(attribute)}
                  sx={{
                    p: 0.5,
                    color: 'text.primary',
                    '&.Mui-checked': { color: 'text.primary' },
                  }}
                />
                <ToggleButtonGroup value={majorSkills} sx={{ flexWrap: 'wrap', width: '100%' }}>
                  {skillsByAttribute[attribute].map((skill) => (
                    <ToggleButton
                      key={skill}
                      value={skill}
                      onChange={() => handleToggleMajorSkill(skill)}
                      sx={{ flex: 1, py: 0.5, fontSize: '0.7rem' }}
                    >
                      <SkillIcon skill={skill} size={12} style={{ marginRight: 3 }} />
                      {shorthandBySkill[skill]}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </React.Fragment>
            ))}
          </div>
          <Box sx={{ minHeight: '1.25rem' }}>
            <Typography variant="caption" sx={{ color: 'error.main', fontSize: '0.7rem' }}>
              {favoredAttributesError || majorSkillsError}
            </Typography>
          </Box>
        </Box>
      </Panel>
    </>
  );
}

export default function CharacterDialog(props: {
  open: boolean;
  remastered: boolean;
  levelsExist: boolean;
  handleClose: () => void;
  onRemasteredToggle: () => void;
  onReset: () => void;
}) {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  const footer = (
    <Box sx={{ borderTop: '1px solid', borderColor: 'divider', px: 1.5, py: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', fontWeight: 'bold' }}>
          Remastered
        </Typography>
        <Switch
          checked={props.remastered}
          color="secondary"
          size="small"
          onClick={props.onRemasteredToggle}
        />
      </Box>
      {props.levelsExist && (
        <Button
          size="small"
          color="error"
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={props.onReset}
          fullWidth
        >
          Reset levels
        </Button>
      )}
    </Box>
  );

  if (isLargeScreen) {
    return (
      <Drawer
        variant="persistent"
        anchor="right"
        open={props.open}
        sx={{
          width: props.open ? CHARACTER_DRAWER_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: CHARACTER_DRAWER_WIDTH,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Box className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto" sx={{ p: 1.5 }}>
          <CharacterContent remastered={props.remastered} onClose={props.handleClose} isDrawer />
        </Box>
        {footer}
      </Drawer>
    );
  }

  return (
    <Dialog onClose={props.handleClose} open={props.open} fullWidth maxWidth="xs">
      <IconButton
        aria-label="close"
        onClick={props.handleClose}
        sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ pt: 5, pb: 0, px: 1.5 }}>
        <CharacterContent remastered={props.remastered} />
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', p: 0 }}>
        {footer}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1.5, pb: 1 }}>
          <Button onClick={props.handleClose}>Done</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
