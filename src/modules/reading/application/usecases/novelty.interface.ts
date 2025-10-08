export interface INovelty {
  id: number;
  title: string;
  description: string;
}

export const NOVELTIES: Record<number, { id: number; title: string }> = {
  1: { id: 1, title: 'NORMAL' },
  2: { id: 2, title: 'WARNING' },
  3: { id: 3, title: 'DANGER' },
};

export const LOWER_NORMAL_FACTOR = 0.6;
export const UPPER_NORMAL_FACTOR = 1.4;
export const LOWER_ALERT_FACTOR = 0.8;
export const UPPER_ALERT_FACTOR = 1.8;