import styled from "styled-components";
import { useLobbyStore } from "../store/useLobbyStore";
import { COLORS } from "./gamecard";

const TabsBar = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  cursor: pointer;
  border: none;
  padding: 0.5rem 1rem;
  background: ${({ $active }) => ($active ? COLORS.green : COLORS.offWhite)};
  color: ${({ $active }) => ($active ? COLORS.white : COLORS.dark)};
  border-radius: 20px;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: ${COLORS.green};
    color: ${COLORS.white};
  }
`;

export const CategoryTabs: React.FC = () => {
  const categories = useLobbyStore((s) => s.categories);
  const active = useLobbyStore((s) => s.activeCategory);
  const setActive = useLobbyStore((s) => s.setActiveCategory);

  return (
    <TabsBar>
      {categories.map((c) => (
        <TabButton
          key={c.id}
          $active={c.id === active}
          onClick={() => setActive(c.id)}
        >
          {c.label}
        </TabButton>
      ))}
    </TabsBar>
  );
};