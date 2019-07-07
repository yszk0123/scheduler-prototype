export type AppType = any;

export type ScheduleModel = {
  type: string;
  id: string;
  offset: number;
  value: number;
  text: string;
};

export enum Color {
  WHITE = 'WHITE',
  BLACK = 'BLACK',
  GREEN = 'GREEN',
  ORANGE = 'ORANGE',
}

export type Schedule = {
  color: Color;
  id: number;
  offset: number;
  value: number;
  text: string;
  highlight: boolean;
  cross: boolean;
};
