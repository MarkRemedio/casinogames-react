import { useEffect } from "react";
import { useLobbyStore } from "../store/useLobbyStore";
import { CategoryTabs } from "../components/categorytabs";
import { GameGrid } from "../components/grid";

const Lobby: React.FC = () => {
  const loadGames = useLobbyStore((s) => s.loadGames);  
  const startPolling = useLobbyStore((s) => s.startJackpotPolling);
  const stopPolling = useLobbyStore((s) => s.stopJackpotPolling);

  const games = useLobbyStore((s) => s.games);
  const loading = useLobbyStore((s) => s.loading);
  const error = useLobbyStore((s) => s.error);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <main>
      <CategoryTabs />
      <GameGrid games={games} />
    </main>
  );
};

export default Lobby;
