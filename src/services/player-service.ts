import { ApiResponse, HistoryEntry, LoginData, PaginatedMeta, Player, Reward, SpinResult } from "@/types";

type PaginatedResult<T> = { data: T[]; meta: PaginatedMeta };

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

  getRewards: async (id: string): Promise<Reward[]> => {
    const res = await fetch(`${BASE_URL}/api/v1/players/${id}/rewards`);
    return unwrap<Reward[]>(await res.json());
  },

  getGlobalSpins: async (page = 1, limit = 10): Promise<PaginatedResult<HistoryEntry>> => {
    const res = await fetch(`${BASE_URL}/api/v1/spins?page=${page}&limit=${limit}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error.message);
    return { data: json.data, meta: json.meta };
  },

  getMySpins: async (id: string, page = 1, limit = 10): Promise<PaginatedResult<HistoryEntry>> => {
    const res = await fetch(`${BASE_URL}/api/v1/players/${id}/spins?page=${page}&limit=${limit}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error.message);
    return { data: json.data, meta: json.meta };
  },

  claimReward: async (id: string, points: number): Promise<Reward> => {
    const res = await fetch(`${BASE_URL}/api/v1/players/${id}/rewards/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points }),
    });
    return unwrap<Reward>(await res.json());
  },
};
