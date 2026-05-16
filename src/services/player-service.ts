import { ApiResponse, LoginData, Player, SpinResult } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const unwrap = <T>(json: ApiResponse<T>): T => {
  if (!json.success) throw new Error(json.error.message);
  return json.data;
};

export const playerService = {
  login: async (username: string): Promise<LoginData> => {
    const res = await fetch(`${BASE_URL}/api/v1/players/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    return unwrap<LoginData>(await res.json());
  },

  getProfile: async (id: string): Promise<Player> => {
    const res = await fetch(`${BASE_URL}/api/v1/players/${id}/profile`);
    return unwrap<Player>(await res.json());
  },

  spin: async (id: string, points: number): Promise<SpinResult> => {
    const res = await fetch(`${BASE_URL}/api/v1/players/${id}/spins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points }),
    });
    return unwrap<SpinResult>(await res.json());
  },
};
