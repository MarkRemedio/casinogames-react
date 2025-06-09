// api/jackpots.ts
import axios from "axios";
import type { Jackpot } from "../types";

const JACKPOT_URL = "http://stage.whgstage.com/front-end-test/jackpots.php";

export async function fetchJackpots(): Promise<Record<string, number>> {
  const { data } = await axios.get<Jackpot[]>(JACKPOT_URL);

  return data.reduce((acc, entry) => {
    acc[entry.game] = entry.amount;
    return acc;
  }, {} as Record<string, number>);
}