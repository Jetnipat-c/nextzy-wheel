import { HistoryEntry, Reward } from "@/types";

type SpinItemProps = {
  type: "spin";
  item: HistoryEntry;
};

type RewardItemProps = {
  type: "reward";
  item: Reward;
};

type HistoryItemProps = SpinItemProps | RewardItemProps;

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = (d.getFullYear() % 100).toString().padStart(2, "0");
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes} น.`;
};

export const HistoryItem = (props: HistoryItemProps) => {
  const isReward = props.type === "reward";
  const username = isReward ? "รางวัล" : props.item.username;
  const points = props.item.points;
  const date = isReward ? props.item.claimed_at : props.item.created_at;

  return (
    <div className="flex flex-row items-center px-6 py-4 gap-5 bg-white border-b border-[#EEEEEE]">
      {/* Profile image */}
      <div
        className="w-12 h-12 rounded-full shrink-0"
        style={{
          background: "linear-gradient(180deg, #973E40 0%, #F41C20 64.58%)",
        }}
      />
      {/* Text */}
      <div className="flex flex-col gap-0.5">
        <span className="font-bold text-[16px] leading-[24px] text-[#333333]">
          {username}
        </span>
        <span className="font-normal text-[14px] leading-[21px] text-[#A3A3A3]">
          {isReward
            ? `ได้รับเมื่อ ${formatDate(date)}`
            : `รางวัล: ${points.toLocaleString()} | เล่นเมื่อ ${formatDate(date)}`}
        </span>
      </div>
    </div>
  );
};
