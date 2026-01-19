// /types/db.ts

export type Match = {
  id: string;
  name: string;
  status: 'live' | 'finished' | 'scheduled';
  created_at: string;
  updated_at: string;
  current_set: number;
  team_a: string;
  team_b: string;
};

export type MatchSet = {
  id: string;
  match_id: string;
  set_number: number;
  team_a_score: number;
  team_b_score: number;
  finished: boolean;
};
