type Props = { points: number; onClose: () => void };

export const SpinResultModal = ({ points, onClose }: Props) => (
  <div className="flex flex-col items-center">
    <div className="mt-6 mb-8 space-y-2">
      <div className="font-medium text-[24px] leading-[36px] text-center text-[#333333]">
        ได้รับ
      </div>
      <div className="font-normal text-[16px] leading-[28px] text-center text-[#212B36]">
        {points.toLocaleString()} คะแนน
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
