import { twMerge } from "tailwind-merge";
export const Image = ({ src, className = null }: { src: string, className?: string | null }) => {
  return (
    <img src={src} className={twMerge("w-full h-full", className)} alt="bg" />
  );
};
