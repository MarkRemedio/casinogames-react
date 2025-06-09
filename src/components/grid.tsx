import styled from "styled-components";
import type { Game } from "../types";
import { GameCard } from "./gamecard";

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
`;

interface GameGridProps {
  games: Game[];
}

export const GameGrid: React.FC<GameGridProps> = ({ games }) => {
  return (
    <Grid>
      {games.map((g) => (
        <GameCard key={g.id} game={g} />
      ))}
    </Grid>
  );
};
