// api/games.ts
import axios from "axios";
import type { Game } from "../types";

const GAMES_URL = "http://stage.whgstage.com/front-end-test/games.php";

export async function fetchGames(): Promise<Game[]> {
  const { data } = await axios.get<Game[]>(GAMES_URL);

  return data.map((game) => ({
    ...game,
    image: game.image.startsWith("//") ? "https:" + game.image : game.image,
  }));
}
