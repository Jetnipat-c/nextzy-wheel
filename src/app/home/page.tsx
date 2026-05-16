"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { usePlayerStore } from "@/store/player-store";
import { playerService } from "@/services/player-service";
import { CHECKPOINTS, MAX_SCORE } from "@/lib/constants";

const HomePage = () => {
  const router = useRouter();
  const { id: playerId } = usePlayerStore();

  useEffect(() => {
    if (!playerId) router.replace("/");
  }, [playerId, router]);

  const { data: player } = useQuery({
    queryKey: ["profile", playerId],
    queryFn: () => playerService.getProfile(playerId!),
    enabled: !!playerId,
  });

  if (!player) return null;

  const nextCheckpoint = CHECKPOINTS.find((cp) => player.total_points < cp.threshold);
  const progressMax = nextCheckpoint?.threshold ?? MAX_SCORE;
  const progressPct = Math.min((player.total_points / progressMax) * 100, 100);

  return (
    <main>
      <p>{player.username}</p>
      <p>คะแนนสะสม: {player.total_points} / {MAX_SCORE}</p>
      <p>progress: {progressPct.toFixed(1)}%</p>

      <section>
        <h2>รางวัล</h2>
        {CHECKPOINTS.map((cp) => {
          const reached = player.total_points >= cp.threshold;
          return (
            <div key={cp.threshold}>
              <span>{cp.label} ({cp.threshold} คะแนน)</span>
              {reached ? (
                <button>รับรางวัล</button>
              ) : (
                <span>ล็อก</span>
              )}
            </div>
          );
        })}
      </section>

      <Link href="/game">ไปเล่นเกม</Link>
    </main>
  );
};

export default HomePage;
