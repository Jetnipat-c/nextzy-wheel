import Image from "next/image";
import { Reward } from "@/types";
import { CHECKPOINTS } from "@/lib/constants";

type Props = { reward: Reward; onClose: () => void };

export const ClaimConfirmModal = ({ reward, onClose }: Props) => {
  const rewardIndex = CHECKPOINTS.findIndex((cp) => cp.threshold === reward.points) + 1;

  return (
  <div className="flex flex-col items-center">
    <Image src="/icons/coin.png" alt="" width={78} height={78} />
    <div className="mt-6 mb-8 space-y-2">
      <div className="font-medium text-[24px] leading-[36px] text-center text-[#333333]">
        ยินดีด้วย
      </div>
      <div className="font-normal text-[16px] leading-[28px] text-center text-[#212B36]">
        คุณได้รับรางวัลที่ {rewardIndex}
      </div>
    </div>
    <button
      onClick={onClose}
      className="flex flex-col justify-center items-center w-[177px] h-12 px-6 py-3 bg-[#FFC124] rounded-full font-bold text-white"
    >
      ปิด
    </button>
  </div>
  );
};
