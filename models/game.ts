export interface Game {
  id: number;
  name: string;
  description: string;
  image_url: string;
  status: 'active' | 'inactive';
  sort: number;
  ingame_currency_name: string;
  created_at: string;
  updated_at: string;
}

export type GameList = Game[];