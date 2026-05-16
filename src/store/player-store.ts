import { create } from "zustand";

type PlayerState = {
  id: string | null;
  username: string | null;
  setPlayer: (id: string, username: string) => void;
  clear: () => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  id: null,
  username: null,
  setPlayer: (id, username) => set({ id, username }),
  clear: () => set({ id: null, username: null }),
}));
