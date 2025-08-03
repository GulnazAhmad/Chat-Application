import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import animationData from "@/assets/lottie-json";
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-[#FFF1E6] text-[#FF6B6B] border-[1px] border-[#FF6B6Baa]", // soft peach + coral red
  "bg-[#E3FCEC] text-[#2B9348] border-[1px] border-[#2B9348aa]", // mint green + forest green
  "bg-[#EDE7F6] text-[#5E35B1] border-[1px] border-[#5E35B1aa]", // soft violet + deep purple
  "bg-[#1E1E2F] text-[#7F5AF0] border-[1px] border-[#7F5AF0aa]", // (unchanged)
];

export const getColor = (color) => {
  if (color > 0 && color.length) {
    return colors[color];
  }
  return colors[0];
};

export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
};
