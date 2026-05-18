"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { usePlayerStore } from "@/store/player-store";

import { playerService } from "@/services/player-service";

import { WHEEL_SEGMENTS, MAX_SCORE } from "@/lib/constants";

import { Modal } from "@/components/ui/modal";
import { BottomBar } from "@/components/ui/bottom-bar";
import { SpinWheel } from "@/components/game/spin-wheel";
import { PageShell } from "@/components/layout/page-shell";
import { SpinResultModal } from "@/components/game/spin-result-modal";

const SEGMENT_DEG = 360 / WHEEL_SEGMENTS.length; // 90°
const SPIN_SPEED = 10; // degrees per frame

const GamePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id: playerId } = usePlayerStore();

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const { data: player } = useQuery({
    queryKey: ["profile", playerId],
    queryFn: () => playerService.getProfile(playerId!),
    enabled: !!playerId,
  });

  const rotationRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!playerId) router.replace("/");
  }, [playerId, router]);

  // Animation loop
  useEffect(() => {
    if (!isSpinning) return;

    const animate = () => {
      rotationRef.current = (rotationRef.current + SPIN_SPEED) % 360;
      setRotation(rotationRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isSpinning]);

  const getPointsFromRotation = (deg: number) => {
    const normalized = (360 - (deg % 360)) % 360;
    const index = Math.floor(normalized / SEGMENT_DEG) % WHEEL_SEGMENTS.length;
    return WHEEL_SEGMENTS[index];
  };

  const { mutate: spin, isPending } = useMutation({
    mutationFn: (points: number) => playerService.spin(playerId!, points),
    onSuccess: (data) => {
      setResult(data.points);
      queryClient.invalidateQueries({ queryKey: ["profile", playerId] });
    },
    onError: (error) => toast.error(error.message),
  });

  const handleStart = () => {
    setResult(null);
    setIsSpinning(true);
  };

  const handleStop = () => {
    if (!isSpinning || isPending) return;
    cancelAnimationFrame(rafRef.current);
    const frozenRot = rotationRef.current;
    setRotation(frozenRot);
    setIsSpinning(false);
    spin(getPointsFromRotation(frozenRot));
  };

  return (
    <PageShell
      bottom={
        <BottomBar label="กลับหน้าหลัก" onClick={() => router.push("/home")} />
      }
      containerClassName="[background:linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,141,11,0.2)_100%)]"
    >
      <div className="flex flex-col flex-1">
        <div className="text-center pt-12">
          <span className="font-semibold text-[24px] leading-[24px] text-[#212B36]">
            คะแนนสะสม {(player?.total_points ?? 0).toLocaleString()} /{" "}
            {MAX_SCORE.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 gap-8">
          <SpinWheel rotation={rotation} />

          <button
            onClick={isSpinning ? handleStop : handleStart}
            disabled={isPending}
            className="w-[120px] h-[38px] rounded-[12.5px] bg-[#FF2428] font-bold text-white text-lg disabled:opacity-50"
          >
            {isPending ? "กำลังบันทึก..." : isSpinning ? "หยุด" : "เริ่มหมุน"}
          </button>
        </div>
      </div>

      <Modal isOpen={result !== null} onClose={() => setResult(null)}>
        <SpinResultModal points={result!} onClose={() => setResult(null)} />
      </Modal>
    </PageShell>
  );
};

export default GamePage;
