"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Reward } from "@/types";

import { usePlayerStore } from "@/store/player-store";

import { playerService } from "@/services/player-service";

import { Modal } from "@/components/ui/modal";
import { BottomBar } from "@/components/ui/bottom-bar";
import { TabBar, Tab } from "@/components/home/tab-bar";
import { PageShell } from "@/components/layout/page-shell";
import { HistoryList } from "@/components/home/history-list";
import { ClaimConfirmModal } from "@/components/home/claim-confirm-modal";
import { ScoreCard, ScoreCardSkeleton } from "@/components/home/score-card";

const HomePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id: playerId } = usePlayerStore();
  const [activeTab, setActiveTab] = useState<Tab>("global");
  const [claimedReward, setClaimedReward] = useState<Reward | null>(null);

  useEffect(() => {
    if (!playerId) router.replace("/");
  }, [playerId, router]);

  const { data: player } = useQuery({
    queryKey: ["profile", playerId],
    queryFn: () => playerService.getProfile(playerId!),
    enabled: !!playerId,
  });

  const { data: rewards = [] } = useQuery({
    queryKey: ["rewards", playerId],
    queryFn: () => playerService.getRewards(playerId!),
    enabled: !!playerId,
  });

  const { mutate: claim } = useMutation({
    mutationFn: (points: number) =>
      playerService.claimReward(playerId!, points),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rewards", playerId] });
      setClaimedReward(data);
    },
    onError: (error) => toast.error(error.message),
  });

  if (!playerId) return null;

  return (
    <PageShell
      bottom={
        <BottomBar label="ไปเล่นเกม" onClick={() => router.push("/game")} />
      }
    >
      {player ? (
        <ScoreCard
          player={player}
          rewards={rewards}
          onClaim={(points) => claim(points)}
        />
      ) : (
        <ScoreCardSkeleton />
      )}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <HistoryList playerId={playerId!} activeTab={activeTab} />

      <Modal
        isOpen={claimedReward !== null}
        onClose={() => setClaimedReward(null)}
      >
        <ClaimConfirmModal
          reward={claimedReward!}
          onClose={() => setClaimedReward(null)}
        />
      </Modal>
    </PageShell>
  );
};

export default HomePage;
