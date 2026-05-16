"use client";

import { useRouter } from "next/navigation";
import { usePlayerStore } from "@/store/player-store";
import { playerService } from "@/services/player-service";

const LandingPage = () => {
  const router = useRouter();
  const setPlayer = usePlayerStore((s) => s.setPlayer);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = (e.currentTarget.elements.namedItem("username") as HTMLInputElement).value.trim();
    if (!username) return;

    const data = await playerService.login(username);
    setPlayer(data.id, data.username);
    router.push("/home");
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="ชื่อผู้เล่น" required />
        <button type="submit">เข้าเล่น</button>
      </form>
    </main>
  );
};

export default LandingPage;
