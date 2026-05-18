import Image from "next/image";
import { WHEEL_SEGMENTS } from "@/lib/constants";

const SIZE = 310;
const cx = SIZE / 2;
const cy = SIZE / 2;
const r = SIZE / 2;
const SEGMENT_DEG = 360 / WHEEL_SEGMENTS.length;

const toRad = (deg: number) => (deg * Math.PI) / 180;

const polarToCartesian = (angleDeg: number, radius = r) => ({
  x: cx + radius * Math.cos(toRad(angleDeg)),
  y: cy + radius * Math.sin(toRad(angleDeg)),
});

const slicePath = (startAngle: number, endAngle: number) => {
  const s = polarToCartesian(startAngle);
  const e = polarToCartesian(endAngle);
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y} Z`;
};

type SpinWheelProps = {
  rotation: number;
};

export const SpinWheel = ({ rotation }: SpinWheelProps) => (
  <div className="relative w-[310px] h-[310px] mx-auto">
    {/* Rotating wheel */}
    <div
      className="w-full h-full"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* Paths first */}
        {WHEEL_SEGMENTS.map((points, i) => {
          const startAngle = i * SEGMENT_DEG - 90;
          const endAngle = startAngle + SEGMENT_DEG;
          return (
            <path key={i} d={slicePath(startAngle, endAngle)} fill="#6b000a" />
          );
        })}

        {/* Lines on top */}
        {WHEEL_SEGMENTS.map((_, i) => {
          const startAngle = i * SEGMENT_DEG - 90;
          const edgePoint = polarToCartesian(startAngle);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={edgePoint.x}
              y2={edgePoint.y}
              stroke="black"
              strokeWidth="4"
            />
          );
        })}

        {/* Text on top */}
        {WHEEL_SEGMENTS.map((points, i) => {
          const startAngle = i * SEGMENT_DEG - 90;
          const midAngle = startAngle + SEGMENT_DEG / 2;
          const textPos = polarToCartesian(midAngle, r * 0.58);
          return (
            <text
              key={i}
              x={textPos.x}
              y={textPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="36"
              fontWeight="normal"
              transform={`rotate(${midAngle + 90}, ${textPos.x}, ${textPos.y})`}
            >
              {points.toLocaleString()}
            </text>
          );
        })}
      </svg>
    </div>

    {/* Coin — centered, does not rotate */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <Image src="/icons/coin.png" alt="" width={60} height={60} />
    </div>

    {/* Pin — half overlaps wheel at top center */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[55%] z-10">
      <Image src="/icons/pin.png" alt="" width={63} height={63} />
    </div>
  </div>
);
