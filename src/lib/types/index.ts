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
    };
  };
}
