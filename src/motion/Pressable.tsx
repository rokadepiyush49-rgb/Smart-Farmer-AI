import { motion, useReducedMotion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";
import { useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";
import { press } from "./springs";
import { cn } from "@/lib/cn";

type Variant = "primary" | "tonal" | "surface" | "ghost" | "sun" | "danger" | "light";
type Size = "sm" | "md" | "lg" | "xl";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-leaf text-white shadow-[0_10px_24px_-8px_rgba(27,122,69,0.65)] hover:bg-leaf-dark",
  tonal: "bg-wash text-leaf-dark hover:bg-wash-deep",
  surface: "bg-surface text-canopy shadow-soft hover:shadow-lift",
  ghost: "bg-transparent text-canopy hover:bg-wash/70",
  sun: "bg-sun text-canopy shadow-[0_10px_24px_-8px_rgba(245,165,36,0.7)]",
  danger: "bg-clay text-white shadow-[0_10px_24px_-8px_rgba(229,72,77,0.6)]",
  /* for use on top of a dark/green surface */
  light: "bg-white text-leaf-dark shadow-[0_10px_24px_-10px_rgba(0,0,0,0.45)] hover:bg-white/92",
};

/** Farmer-first: nothing tappable is ever smaller than 44px, CTAs are 56–64px. */
const sizeClass: Record<Size, string> = {
  sm: "h-11 px-4 text-sm rounded-full gap-2",
  md: "h-14 px-5 text-[15px] rounded-2xl gap-2.5",
  lg: "h-16 px-6 text-base rounded-[20px] gap-3",
  xl: "h-[68px] px-7 text-lg rounded-[22px] gap-3",
};

type Ripple = { id: number; x: number; y: number };

export interface PressableProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  /** Turn the ink ripple off for tiny icon buttons where it reads as noise. */
  ripple?: boolean;
}

/**
 * The single button primitive for the whole app.
 *
 * Three layers of feedback fire on every tap, which is what makes a press feel
 * physical rather than merely "animated":
 *   1. a spring scale-down that settles rather than snaps,
 *   2. the shadow collapsing, so the button visibly meets the surface,
 *   3. an ink ripple travelling out from the exact contact point.
 */
export function Pressable({
  variant = "primary",
  size = "md",
  block,
  ripple = true,
  className,
  children,
  onPointerDown,
  ...rest
}: PressableProps) {
  const reduce = useReducedMotion();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const seed = useRef(0);

  const handlePointerDown = useCallback<NonNullable<PressableProps["onPointerDown"]>>(
    (event) => {
      onPointerDown?.(event);
      if (!ripple || reduce) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const id = seed.current++;
      setRipples((r) => [
        ...r,
        { id, x: event.clientX - rect.left, y: event.clientY - rect.top },
      ]);
      window.setTimeout(
        () => setRipples((r) => r.filter((item) => item.id !== id)),
        520,
      );
    },
    [onPointerDown, ripple, reduce],
  );

  return (
    <motion.button
      type="button"
      onPointerDown={handlePointerDown}
      whileTap={reduce ? undefined : { scale: 0.955, y: 1 }}
      whileHover={reduce ? undefined : { y: -1.5 }}
      transition={press}
      className={cn(
        "relative isolate inline-flex select-none items-center justify-center overflow-hidden",
        "font-display font-bold outline-none transition-colors duration-200",
        "focus-visible:ring-4 focus-visible:ring-sprout/45",
        "disabled:pointer-events-none disabled:opacity-45",
        sizeClass[size],
        variantClass[variant],
        block && "w-full",
        className,
      )}
      {...rest}
    >
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          aria-hidden
          initial={{ opacity: 0.4, scale: 0 }}
          animate={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.52, ease: "easeOut" }}
          style={{ left: r.x, top: r.y }}
          className="pointer-events-none absolute -z-10 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
        />
      ))}
      {children as ReactNode}
    </motion.button>
  );
}

/** Card-shaped tap target: same physics, no button chrome. */
export function PressableCard({
  className,
  children,
  ...rest
}: Omit<HTMLMotionProps<"button">, "ref">) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      whileTap={reduce ? undefined : { scale: 0.972 }}
      whileHover={reduce ? undefined : { y: -3 }}
      transition={press}
      className={cn(
        "relative overflow-hidden text-left outline-none",
        "focus-visible:ring-4 focus-visible:ring-sprout/45",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
