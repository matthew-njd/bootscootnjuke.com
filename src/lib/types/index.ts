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
      stats: {
        Row: {
          id: number;
          ownerId: string;
          year: number;
          team: string;
          wins: number;
          loses: number;
          ptsFor: number;
          ptsAgst: number;
          finalPlace: number;
        };
      };
      highest_week_totals: {
        Row: {
          id: number;
          year: number;
          week: number;
          team: string;
          points: number;
          owner: string;
          ownerId: string;
        };
      };
      highest_player_totals: {
        Row: {
          id: number;
          year: number;
          week: number;
          team: string;
          player: string;
          points: number;
          owner: string;
          ownerId: string;
        };
      };
    };
  };
}

export interface Owners {
  owner: {
    id: number;
    ownerId: string;
    name: string;
    active: boolean;
    bio: string;
    logoUrl: string;
  }[];
}

export interface Leaderboards {
  champs: { name: string; titlewins: number }[];

  stats: {
    ownerId: string;
    year: number;
    team: string;
    wins: number;
    loses: number;
    ptsFor: number;
    ptsAgst: number;
    finalPlace: number;
  }[];

  highest_week_totals: {
    year: number;
    week: number;
    team: string;
    points: number;
    owner: string;
  }[];

  highest_player_totals: {
    year: number;
    week: number;
    team: string;
    player: string;
    points: number;
    owner: string;
  }[];
}
