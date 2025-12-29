export interface Database {
  public: {
    Tables: {
      drafts: {
        Row: {
          id: number;
          year: number | null;
          pick: number | null;
          player: string | null;
          playerHeadshotUrl: string | null;
          team: string | null;
          owner: string | null;
          draftId: string | null;
        };
      };
      leaderboards: {
        Row: {
          id: number;
          year: number | null;
          team: number | null;
          points: number | null;
          owner: string | null;
          week: number | null;
          player: string | null;
          ownderId: string | null;
          leaderboardId: string | null;
        };
      };
      owners: {
        Row: {
          id: number;
          active: boolean | null;
          bio: string | null;
          logoUrl: string | null;
          name: string | null;
          ownerId: string;
        };
      };
      stats: {
        Row: {
          id: number;
          loses: number | null;
          ownerId: string | null;
          ptsAgst: number | null;
          ptsFor: number | null;
          team: string | null;
          wins: number | null;
          year: number | null;
          finalPlace: number | null;
        };
      };
    };
  };
}

export interface Owners {
  owner: {
    id: number;
    ownerId: string;
    name: string | undefined;
    active: boolean;
    bio: string;
    logoUrl: string | undefined;
  }[];
}

export interface Leaderboards {
  champs: {
    name: string;
    ownerId: string;
    titlewins: number;
  }[];

  highest_week_totals: {
    year: number;
    week: number;
    team: string;
    points: number;
    owner: string;
    leaderboardId: string;
  }[];

  highest_player_totals: {
    year: number;
    week: number;
    team: string;
    player: string;
    points: number;
    owner: string;
    leaderboardId: string;
  }[];

  highest_seasonal_totals: {
    year: number;
    team: string;
    points: number;
    owner: string;
    leaderboardId: string;
  }[];
}

export interface Drafts {
  draft: {
    year: number;
    pick: number;
    player: string;
    playerHeadshotUrl: string;
    team: string;
    owner: string;
    draftId: string;
  }[];
}

export interface Matchups {
  matchup: {
    points: number;
    players_points: number[];
  }[];
}
