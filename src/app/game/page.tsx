"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePlayerStore } from "@/store/player-store";
import { playerService } from "@/services/player-service";
import { WHEEL_SEGMENTS } from "@/lib/constants";

const SEGMENT_DEG = 360 / WHEEL_SEGMENTS.length; // 90°
const SPIN_SPEED = 10; // degrees per frame

const GamePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id: playerId } = usePlayerStore();

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);

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
    const normalized = ((deg % 360) + 360) % 360;
    const index = Math.floor(normalized / SEGMENT_DEG) % WHEEL_SEGMENTS.length;
    return WHEEL_SEGMENTS[index];
  };

  const { mutate: spin, isPending } = useMutation({
    mutationFn: (points: number) => playerService.spin(playerId!, points),
    onSuccess: (data) => {
      setIsSpinning(false);
      setResult(data.points);
      queryClient.invalidateQueries({ queryKey: ["profile", playerId] });
    },
  });

  const handleStart = () => {
    setResult(null);
    setIsSpinning(true);
  };

  const handleStop = () => {
    if (!isSpinning || isPending) return;
    const points = getPointsFromRotation(rotationRef.current);
    spin(points);
  };

  return (
    <main>
      {/* Wheel */}
      <div style={{ transform: `rotate(${rotation}deg)` }}>
        {WHEEL_SEGMENTS.map((points, i) => (
          <div key={points} style={{ transform: `rotate(${i * SEGMENT_DEG}deg)` }}>
            {points}
          </div>
        ))}
      </div>

      {/* Controls */}
      {!isSpinning ? (
        <button onClick={handleStart}>เริ่มหมุน</button>
      ) : (
        <button onClick={handleStop} disabled={isPending}>หยุด</button>
      )}

      <button onClick={() => router.push("/home")}>กลับหน้าหลัก</button>

      {/* Result Modal */}
      {result !== null && (
        <dialog open>
          <p>ได้รับ {result} คะแนน!</p>
          <button onClick={() => setResult(null)}>ปิด</button>
        </dialog>
      )}
    </main>
  );
};

export default GamePage;
