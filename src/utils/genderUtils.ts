export type Gender = 'Male' | 'Female';
const genders: Gender[] = ['Male', 'Female'];

export type LocationOrigin =
  | 'Arnesia'
  | 'Thornmarsh'
  | 'Systres'
  | 'High Rock'
  | 'Vvardenfell'
  | 'Mainland'
  | 'Auridon'
  | 'Summerset Isle'
  | 'Nibenay'
  | 'Colovia'
  | 'Anequina'
  | 'Pellitine'
  | 'Western'
  | 'Eastern'
  | 'Stronghold'
  | 'Orsinium'
  | 'Dragontail Mountains'
  | "Alik'r Desert"
  | 'Grahtwood'
  | "Reaper's March";

export const genderByLocationOrigin: { [key in LocationOrigin]: Gender } = {
  Arnesia: 'Male',
  Thornmarsh: 'Female',
  Systres: 'Male',
  'High Rock': 'Female',
  Vvardenfell: 'Male',
  Mainland: 'Female',
  Auridon: 'Male',
  'Summerset Isle': 'Female',
  Nibenay: 'Male',
  Colovia: 'Female',
  Anequina: 'Male',
  Pellitine: 'Female',
  Western: 'Male',
  Eastern: 'Female',
  Stronghold: 'Male',
  Orsinium: 'Female',
  'Dragontail Mountains': 'Male',
  "Alik'r Desert": 'Female',
  Grahtwood: 'Male',
  "Reaper's March": 'Female',
};

export default genders;
