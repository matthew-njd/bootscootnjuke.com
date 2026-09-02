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
          sleeperId: string;
        };
      };
      recaps: {
        Row: {
          id: number;
          year: number;
          week: number;
          body: string;
          created_at: string;
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

export interface Champion {
  name: string;
  ownerId: string;
  titlewins: number;
}

export interface HighestWeekTotal {
  year: number;
  week: number;
  team: string;
  points: number;
  owner: string;
  leaderboardId: string;
}

export interface HighestPlayerTotal {
  year: number;
  week: number;
  team: string;
  player: string;
  points: number;
  owner: string;
  leaderboardId: string;
}

export interface HighestSeasonalTotal {
  year: number;
  team: string;
  points: number;
  owner: string;
  leaderboardId: string;
}

export interface Leaderboards {
  champs: Champion[];
  highest_week_totals: HighestWeekTotal[];
  highest_player_totals: HighestPlayerTotal[];
  highest_seasonal_totals: HighestSeasonalTotal[];
}

export interface Draft {
  year: number;
  pick: number;
  player: string;
  playerHeadshotUrl: string;
  team: string;
  owner: string;
  draftId: string;
}

export interface Drafts {
  draft: Draft[];
}

export interface Sleeper {
  User: {
    user_id: number;
    display_name: string;
    is_owner: boolean;
    metadata: {
      team_name: string;
      avatar: string;
    };
  };

  Roster: {
    owner_id: number;
    roster_id: number;
  };

  Matchup: {
    points: number;
    roster_id: number;
    matchup_id: number;
    starters: string[];
    players: string[];
    custom_points: number | null;
  };
}
