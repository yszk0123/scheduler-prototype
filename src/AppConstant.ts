import { Color } from './AppType';

type ColorTheme = {
  active: string;
  inactive: string;
};

export const colors: Record<Color, ColorTheme> = {
  [Color.WHITE]: {
    active: 'white',
    inactive: 'white',
  },
  [Color.BLACK]: {
    active: 'rgba(0, 0, 0, 0.3)',
    inactive: 'rgba(0, 0, 0, 0.3)',
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
