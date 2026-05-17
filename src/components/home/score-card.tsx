import Image from "next/image";
import { Player, Reward } from "@/types";
import { CHECKPOINTS, MAX_SCORE } from "@/lib/constants";

type ScoreCardProps = {
  player: Player;
  rewards: Reward[];
  onClaim: (points: number) => void;
};

const POSITIONS = [10, 45, 100] as const;

const STOPS = [
  { points: 0, pct: 0 },
  ...CHECKPOINTS.map((cp, i) => ({ points: cp.threshold, pct: POSITIONS[i] })),
];

const getFillPct = (totalPoints: number) => {
  for (let i = 1; i < STOPS.length; i++) {
    const prev = STOPS[i - 1];
    const curr = STOPS[i];
    if (totalPoints <= curr.points) {
      const t = (totalPoints - prev.points) / (curr.points - prev.points);
      return prev.pct + t * (curr.pct - prev.pct);
    }
  }
  return 100;
};

export const ScoreCardSkeleton = () => (
  <div className="p-4 bg-[#d6d6d6]">
    <div className="relative w-full bg-white border border-black rounded-2xl px-3.5 py-5 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded ml-auto mb-2" />
      <div className="h-4 w-48 bg-gray-200 rounded ml-auto mb-2" />
      <div className="h-6 w-32 bg-gray-200 rounded ml-auto mb-4" />
      <div className="h-5 w-full bg-gray-200 rounded mb-2" />
      <div className="h-2 w-full bg-gray-200 rounded-full mb-6" />
      <div className="flex justify-between">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-5 w-16 bg-gray-200 rounded-full" />
        ))}
      </div>
    </div>
  </div>
);

export const ScoreCard = ({ player, rewards, onClaim }: ScoreCardProps) => {
  const fillPct = getFillPct(player.total_points);
  const claimedPoints = new Set(rewards.map((r) => r.points));

  return (
    <div className="p-4 bg-[#d6d6d6]">
      <div className="relative w-full bg-white border border-black rounded-2xl px-3.5 py-5">
        {/* Badge */}
        <div className="flex flex-row items-center justify-center absolute top-[15px] left-0 w-[70px] h-[22px] px-2 py-0.5 bg-[#B63335] rounded-r-[16px]">
          <span className="font-medium text-[10px] leading-[16px] text-center text-white">
            แชร์คะแนน
          </span>
        </div>

        {/* Content */}
        <h1 className="font-semibold text-[16px] leading-[24px] text-right text-[#212B36]">
          สะสมคะแนน
        </h1>
        <p className="font-medium text-[16px] leading-[24px] text-right text-[#212B36]">
          คะแนนครบ 10,000 รับของขวัญ 1 รายการ
        </p>
        <div className="font-semibold text-[24px] text-right leading-[24px] text-[#FF2428]">
          {player.total_points.toLocaleString()}/{MAX_SCORE.toLocaleString()}
        </div>

        {/* Row 1: Labels */}
        <div className="relative h-5">
          {CHECKPOINTS.map((cp, i) => {
            const isLast = i === CHECKPOINTS.length - 1;
            return (
              <span
                key={cp.threshold}
                className="absolute bottom-0 whitespace-nowrap text-xs text-gray-500"
                style={{
                  left: `${POSITIONS[i]}%`,
                  transform: `translateX(${isLast ? "-100%" : "-50%"})`,
                }}
              >
                ครบ {cp.threshold.toLocaleString()}
              </span>
            );
          })}
        </div>

        {/* Row 2: Bar + Fill + Markers */}
        <div
          className="relative w-full mt-4 mb-6"
          style={{
            height: "8.66px",
            background: "#DFE3E8",
            borderRadius: "16px",
          }}
        >
          {/* Fill */}
          <div
            className="absolute left-0 h-full rounded-[8px]"
            style={{
              width: `${fillPct}%`,
              background: "linear-gradient(90deg, #FF8158 0%, #FF8902 159.71%)",
            }}
          />
          {/* Fill tip */}
          {fillPct > 0 && fillPct < 100 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[18px] h-[18px] rounded-full"
              style={{
                left: `min(${fillPct}%, calc(100% - 15px))`,
                background: "linear-gradient(180deg, #FF0004 0%, #FC8625 100%)",
              }}
            />
          )}
          {/* Markers */}
          {CHECKPOINTS.map((cp, i) => {
            const isLast = i === CHECKPOINTS.length - 1;
            const size = isLast ? 30 : 20;
            return (
              <div
                key={cp.threshold}
                className="absolute top-1/2"
                style={{
                  left: `${POSITIONS[i]}%`,
                  width: size,
                  height: size,
                  transform: `translateX(${isLast ? "-100%" : "-50%"}) translateY(-50%)`,
                }}
              >
                <Image
                  src={
                    isLast
                      ? "/icons/coin.png"
                      : claimedPoints.has(cp.threshold)
                        ? "/icons/check.png"
                        : "/icons/uncheck.png"
                  }
                  alt=""
                  width={size}
                  height={size}
                />
              </div>
            );
          })}
        </div>

        {/* Row 3: Reward Buttons */}
        <div className="relative h-5">
          {CHECKPOINTS.map((cp, i) => {
            const isLast = i === CHECKPOINTS.length - 1;
            const claimed = claimedPoints.has(cp.threshold);
            const canClaim = player.total_points >= cp.threshold && !claimed;

            const bg = claimed ? "#FF7B7B" : canClaim ? "#FF0004" : "#DDDDDD";
            const width = canClaim ? 69 : 80;

            return (
              <button
                key={cp.threshold}
                disabled={!canClaim}
                onClick={() => canClaim && onClaim(cp.threshold)}
                className="absolute top-0 flex items-center justify-center"
                style={{
                  left: `${POSITIONS[i]}%`,
                  transform: `translateX(${isLast ? "-100%" : "-50%"})`,
                  width,
                  height: 20,
                  borderRadius: "12.5px",
                  background: bg,
                }}
              >
                <span className="text-white text-[10px] font-medium">
                  {claimed ? `รับรางวัล ${i + 1} แล้ว` : `รับรางวัล ${i + 1}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
