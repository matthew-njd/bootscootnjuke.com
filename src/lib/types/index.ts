export interface Owner {
  id: string;
  active: boolean;
  name: string;
  bio: string;
  logo: string;
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

export interface Database {
  public: {
    Tables: {
      owners: {
        Row: {
          id: number;
          ownerId: string;
          name: string;
          active: boolean;
          bio: string;
          logoUrl: string;
        };
      };
    };
  };
}
