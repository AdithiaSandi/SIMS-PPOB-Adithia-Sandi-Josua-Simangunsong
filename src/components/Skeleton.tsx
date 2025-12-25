import clsx from "clsx";

interface SkeletonProps {
  className?: string;
  variant?: "rectangle" | "circle" | "text";
  width?: string | number;
  height?: string | number;
}

const Skeleton = ({
  className,
  variant = "rectangle",
  width,
  height,
}: SkeletonProps) => {
  return (
    <div
      className={clsx(
        "animate-pulse bg-gray-200/80",
        {
          "rounded-full": variant === "circle",
          "rounded-md": variant === "rectangle",
          "rounded-sm h-[1em] w-full": variant === "text",
        },
        className
      )}
      style={{
        width,
        height,
      }}
    />
  );
};

export default Skeleton;
