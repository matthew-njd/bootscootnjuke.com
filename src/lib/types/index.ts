export interface Owner {
  id: string;
  name: string;
  active: boolean;
}

export interface Season {
  id: string;
  year: number;
  team: string;
  wins: number;
  loses: number;
  ptsFor: number;
  ptsAgst: number;
  finalPlace: number;
}
