import { motion, useReducedMotion } from "motion/react";
import { Cloud, CloudRain, Sun } from "lucide-react";

export function WeatherIcon({
  icon,
  className = "h-6 w-6",
  animate = false,
}: {
  icon: "sun" | "cloud" | "rain";
  className?: string;
  animate?: boolean;
}) {
  const reduce = useReducedMotion();
  const live = animate && !reduce;

  if (icon === "sun")
    return (
      <motion.span
        className="inline-block text-sun"
        animate={live ? { rotate: 360 } : {}}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
      >
        <Sun className={className} strokeWidth={2.2} />
      </motion.span>
    );

  if (icon === "cloud")
    return (
      <motion.span
        className="inline-block text-[#94a7b8]"
        animate={live ? { x: [0, 3, 0] } : {}}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cloud className={className} strokeWidth={2.2} />
      </motion.span>
    );

  return (
    <motion.span
      className="inline-block text-sky"
      animate={live ? { y: [0, 2, 0] } : {}}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <CloudRain className={className} strokeWidth={2.2} />
    </motion.span>
  );
}
