import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/cn";
import { ease, gentle, pop, riseItem, stagger } from "@/motion/springs";
import { Pressable } from "@/motion/Pressable";

/* ------------------------------------------------------------------ cards */

export function Card({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-[24px] bg-surface p-5 shadow-soft", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Staggered container — drop any number of <Rise> children inside. */
export function RiseGroup({
  className,
  children,
  gap,
}: {
  className?: string;
  children: ReactNode;
  gap?: number;
}) {
  return (
    <motion.div
      variants={stagger(gap)}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Rise({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div variants={riseItem} className={className}>
      {children}
    </motion.div>
  );
}

/* --------------------------------------------------------------- headings */

export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-3 flex items-end justify-between px-1">
      <h2 className="font-display text-[19px] font-extrabold text-canopy">{title}</h2>
      {action && (
        <button
          onClick={onAction}
          className="text-sm font-semibold text-leaf transition-colors hover:text-leaf-dark"
        >
          {action}
        </button>
      )}
    </div>
  );
}

/** Sticky screen header with a back affordance sized for a thumb. */
export function ScreenHeader({
  title,
  subtitle,
  right,
  tone = "cream",
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  tone?: "cream" | "canopy";
}) {
  const navigate = useNavigate();
  const dark = tone === "canopy";
  return (
    <div
      className={cn(
        "sticky top-0 z-30 flex items-center gap-3 px-4 pt-4 pb-3 backdrop-blur-xl",
        dark ? "bg-canopy/95 text-white" : "bg-cream/88 text-canopy",
      )}
    >
      <Pressable
        variant="ghost"
        size="sm"
        ripple={false}
        aria-label="Go back"
        onClick={() => navigate(-1)}
        className={cn(
          "h-11 w-11 shrink-0 px-0",
          dark ? "bg-white/15 text-white hover:bg-white/25" : "bg-surface shadow-soft",
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </Pressable>
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-[20px] font-extrabold leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className={cn("truncate text-[13px]", dark ? "text-white/70" : "text-muted")}>
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

/* ------------------------------------------------------------------ chips */

export function Tag({
  children,
  tone = "wash",
  className,
}: {
  children: ReactNode;
  tone?: "wash" | "sun" | "clay" | "sky" | "soil" | "canopy";
  className?: string;
}) {
  const tones = {
    wash: "bg-wash text-leaf-dark",
    sun: "bg-sun-wash text-[#9a6608]",
    clay: "bg-clay-wash text-clay",
    sky: "bg-sky-wash text-[#1d6cb0]",
    soil: "bg-soil-wash text-soil",
    canopy: "bg-canopy text-white",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------- indicators */

/** Animated confidence dial used by every AI result in the app. */
export function ConfidenceRing({
  value,
  size = 72,
  tone = "#1B7A45",
  label,
}: {
  value: number;
  size?: number;
  tone?: string;
  label?: string;
}) {
  const reduce = useReducedMotion();
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#ECE7DB" strokeWidth="7" fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={tone}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? c * (1 - value / 100) : c }}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        />
      </svg>
      <div className="absolute grid place-items-center text-center leading-none">
        <CountUp to={value} className="font-display text-[17px] font-extrabold" suffix="%" />
        {label && <span className="mt-0.5 text-[9.5px] font-semibold text-muted">{label}</span>}
      </div>
    </div>
  );
}

/** Number that animates up to its value — makes results feel computed. */
export function CountUp({
  to,
  className,
  prefix = "",
  suffix = "",
  duration = 900,
}: {
  to: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) return setN(to);
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, reduce]);
  return (
    <span className={className}>
      {prefix}
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/** Horizontal bar that grows on mount — used for the "why" explanations. */
export function MeterBar({
  value,
  tone = "bg-leaf",
  delay = 0,
}: {
  value: number;
  tone?: string;
  delay?: number;
}) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-hair">
      <motion.div
        className={cn("h-full rounded-full", tone)}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ ...ease, duration: 0.9, delay }}
      />
    </div>
  );
}

/** Shimmering placeholder for anything still loading. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-hair/70", className)}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.35, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/** Success checkmark that draws itself, then settles. */
export function SuccessCheck({ size = 88 }: { size?: number }) {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={pop}
      className="relative grid place-items-center rounded-full bg-wash"
      style={{ width: size, height: size }}
    >
      <motion.span
        className="absolute inset-0 rounded-full border-2 border-sprout"
        initial={{ scale: 0.8, opacity: 0.9 }}
        animate={{ scale: 1.45, opacity: 0 }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
      />
      <svg viewBox="0 0 48 48" width={size * 0.5} height={size * 0.5}>
        <motion.path
          d="M13 25l7.5 7.5L35 17"
          fill="none"
          stroke="#1B7A45"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}

/** Segmented control with a shared-layout pill that slides between options. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  id,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  id: string;
}) {
  return (
    <div className="flex rounded-full bg-wash p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative flex-1 rounded-full px-3 py-2.5 text-[13.5px] font-bold transition-colors",
              active ? "text-white" : "text-leaf-dark",
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                transition={gentle}
                className="absolute inset-0 rounded-full bg-leaf"
              />
            )}
            <span className="relative z-10">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
