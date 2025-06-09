export type GameCategory = string;

export interface Game {
  id: string;
  name: string;
  image: string;
  categories: GameCategory[];
}

export interface Jackpot {
  game: string;
  amount: number;
}