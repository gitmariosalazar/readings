export type Novelty = {
  id: number;
  title: string;
  description: string;
}

export const novelties: Novelty[] = [
  { id: 1, title: 'NORMAL', description: 'Lectura con consumo normal.' },
  { id: 2, title: 'CONSUMO BAJO', description: 'Lectura con consumo inusualmente bajo.' },
  { id: 3, title: 'CONSUMO ALTO', description: 'Lectura con consumo inusualmente alto.' },
];

export function getNoveltyById(id: number): Novelty {
  return novelties.find(novelty => novelty.id === id) || novelties[0];
}

export function getNoveltyByTitle(title: string): Novelty {
  return novelties.find(novelty => novelty.title === title) || novelties[0];
}

export function getAllNovelties(): Novelty[] {
  return novelties;
}