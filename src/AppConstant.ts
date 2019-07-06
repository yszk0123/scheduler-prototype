import { Color, Schedule } from './AppType';

export const schedules: Schedule[] = [
  {
    id: 0,
    offset: 0,
    value: 0.2,
    color: Color.GREEN,
    text: 'breakfast',
    highlight: false,
  },
  {
    id: 1,
    offset: 0.25,
    value: 0.32,
    color: Color.ORANGE,
    text: 'lunch',
    highlight: false,
  },
  {
    id: 2,
    offset: 0.6,
    value: 0.18,
    color: Color.GREEN,
    text: 'running',
    highlight: true,
  },
  {
    id: 3,
    offset: 0.8,
    value: 0.15,
    color: Color.ORANGE,
    text: 'dinner',
    highlight: false,
  },
];

type ColorTheme = {
  active: string;
  inactive: string;
};

export const colors: Record<Color, ColorTheme> = {
  [Color.WHITE]: {
    active: 'white',
    inactive: 'white',
  },
  [Color.GREEN]: {
    active: '#4c8c4a',
    inactive: '#1b5e20',
  },
  [Color.ORANGE]: {
    active: '#ffa040',
    inactive: '#ff6f00',
  },
};
