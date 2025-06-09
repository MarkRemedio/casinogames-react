import styled, { css } from "styled-components";
import { useLobbyStore } from "../store/useLobbyStore";
import type { Game } from "../types";

export const COLORS = {
  green: "#8DC63F",
  dark: "#373737",
  white: "#FFFFFF",
  offWhite: "#FCFCFC",
};

const CardContainer = styled.article`
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  background: ${COLORS.offWhite};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover img {
    transform: scale(1.05);
  }

  &:hover .overlay {
    opacity: 1;
  }
`;

const GameImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.25s;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(55, 55, 55, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.25s;

  & h4 {
    margin-top: 0.5rem;
    color: ${COLORS.white};
    font-size: 0.9rem;
    text-align: center;
  }

  & button {
    background: ${COLORS.green};
    color: ${COLORS.white};
    border: none;
    padding: 0.4rem 1rem;
    border-radius: 999px;
    cursor: pointer;
    font-weight: 600;
  }
`;

const Ribbon = styled.span<{ $type: "new" | "top" }>`
  position: absolute;
  top: 0.5rem;
  left: -1.5rem;
  width: 6rem;
  text-align: center;
  font-size: 0.7rem;
  color: ${COLORS.white};
  transform: rotate(-45deg);
  ${({ $type }) =>
    $type === "new"
      ? css`
          background: ${COLORS.green};
        `
      : css`
          background: ${COLORS.dark};
        `}
`;

const JackpotBadge = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  background: ${COLORS.dark};
  color: ${COLORS.white};
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
`;

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  console.log(`game: ${game.id}`);
  const jackpot = useLobbyStore((s) => s.jackpots[game.id]);
  console.log(`jackpots: ${JSON.stringify(useLobbyStore((s) => s.jackpots))}`);
  
  const activeCategory = useLobbyStore((s) => s.activeCategory);

  const showNew = game.categories.includes("new") && activeCategory !== "new";
  const showTop = game.categories.includes("top") && activeCategory !== "top";

  return (
    <CardContainer>
      <GameImg src={game.image} alt={game.name} loading="lazy" />
      <Overlay className="overlay">
        <button type="button">Play</button>
        <h4>{game.name}</h4>
      </Overlay>

      {showNew && <Ribbon $type="new">NEW</Ribbon>}
      {showTop && <Ribbon $type="top">TOP</Ribbon>}

      {jackpot !== undefined && (
        <JackpotBadge>£{jackpot.toLocaleString()}</JackpotBadge>
      )}
    </CardContainer>
  );
};
