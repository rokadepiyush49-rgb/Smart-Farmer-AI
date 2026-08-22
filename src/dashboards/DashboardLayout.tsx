import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Bell, Menu, Search, Smartphone, X } from "lucide-react";
import { gentle, press } from "@/motion/springs";
import { cn } from "@/lib/cn";

export type NavItem = { key: string; label: string; icon: React.ElementType; badge?: number };

/**
 * Desktop-first shell shared by the expert, factory and admin consoles.
 * Same design language as the app — cream ground, soft cards, green accent —
 * but denser, because these users are at a desk with a mouse.
 */
export function DashboardLayout({
  brand,
  role,
  nav,
  active,
  onNavigate,
  user,
  children,
}: {
  brand: string;
  role: string;
  nav: NavItem[];
  active: string;
  onNavigate: (key: string) => void;
  user: { name: string; sub: string; hue: string };
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col bg-canopy px-4 py-6 text-white">
      <div className="mb-8 flex items-center gap-3 px-2">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sprout/20">
          <LeafMark />
        </span>
        <div>
          <p className="font-display text-[16px] font-extrabold leading-tight">{brand}</p>
          <p className="text-[11.5px] text-white/55">{role}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const isActive = item.key === active;
          return (
            <button
              key={item.key}
              onClick={() => {
                onNavigate(item.key);
                setOpen(false);
              }}
              className={cn(
                "relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-[14px] font-semibold transition-colors",
                isActive ? "text-white" : "text-white/60 hover:text-white",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="dash-nav"
                  transition={gentle}
                  className="absolute inset-0 rounded-2xl bg-white/12"
                />
              )}
              <item.icon className="relative z-10 h-[18px] w-[18px]" />
              <span className="relative z-10 flex-1">{item.label}</span>
              {item.badge ? (
                <span className="relative z-10 rounded-full bg-sun px-2 py-0.5 text-[11px] font-extrabold text-canopy">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <Link
        to="/"
        className="mt-4 flex items-center gap-2.5 rounded-2xl bg-white/8 px-3.5 py-3 text-[13px] font-semibold text-white/70 transition-colors hover:bg-white/14 hover:text-white"
      >
        <Smartphone className="h-4 w-4" /> Open farmer app
      </Link>
    </div>
  );

  return (
    <div className="flex min-h-dvh bg-[#F4F6F2]">
      {/* desktop sidebar */}
      <aside className="hidden w-[264px] shrink-0 lg:block">
        <div className="sticky top-0 h-dvh">{sidebar}</div>
      </aside>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-canopy/50" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="relative h-full w-[272px]"
            >
              {sidebar}
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-5 grid h-9 w-9 place-items-center rounded-full bg-white/12 text-white"
                aria-label="Close menu"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-black/5 bg-[#F4F6F2]/85 px-4 py-3.5 backdrop-blur-xl lg:px-8">
          <button
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-soft lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-canopy" />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 shadow-soft sm:max-w-sm">
            <Search className="h-4 w-4 shrink-0 text-muted" />
            <input
              placeholder="Search…"
              className="min-w-0 flex-1 bg-transparent text-[14px] text-canopy outline-none placeholder:text-muted"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.94 }}
            transition={press}
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white shadow-soft"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px] text-canopy" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-clay ring-2 ring-white" />
          </motion.button>

          <div className="flex shrink-0 items-center gap-2.5 rounded-2xl bg-white py-1.5 pl-1.5 pr-3.5 shadow-soft">
            <span
              className="grid h-8 w-8 place-items-center rounded-xl font-display text-[13px] font-extrabold text-white"
              style={{ background: user.hue }}
            >
              {user.name[0]}
            </span>
            <div className="hidden sm:block">
              <p className="text-[13px] font-bold leading-tight text-canopy">{user.name}</p>
              <p className="text-[11px] leading-tight text-muted">{user.sub}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function LeafMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden>
      <path
        d="M16 28c-8-3-13-10-13-18 0-2 0-4 1-6 5 2 10 3 14 7 4 3 6 8 4 13-1 2-3 4-6 4z"
        fill="#34C77B"
      />
      <path d="M16 28c-2-8-1-15 3-21" stroke="#0F3D2E" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------- shared building blocks */

export function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  tone = "leaf",
  index = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  delta?: string;
  tone?: "leaf" | "sun" | "sky" | "clay";
  index?: number;
}) {
  const tones = {
    leaf: "bg-wash text-leaf-dark",
    sun: "bg-sun-wash text-[#9a6608]",
    sky: "bg-sky-wash text-sky",
    clay: "bg-clay-wash text-clay",
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, ...gentle }}
      whileHover={{ y: -4 }}
      className="rounded-[22px] bg-white p-5 shadow-soft"
    >
      <div className="flex items-start justify-between">
        <span className={cn("grid h-11 w-11 place-items-center rounded-2xl", tones[tone])}>
          <Icon className="h-5 w-5" />
        </span>
        {delta && (
          <span className="rounded-full bg-wash px-2.5 py-1 text-[12px] font-bold text-leaf-dark">
            {delta}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-[28px] font-extrabold leading-none text-canopy">{value}</p>
      <p className="mt-1.5 text-[13px] text-muted">{label}</p>
    </motion.div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[22px] bg-white p-5 shadow-soft", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-[17px] font-extrabold text-canopy">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Small area chart, drawn from scratch so the dashboards ship no chart library. */
export function AreaChart({
  data,
  labels,
  color = "#1B7A45",
  height = 160,
}: {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
}) {
  const w = 520;
  const h = height;
  const max = Math.max(...data) * 1.15;
  const step = w / (data.length - 1);
  const pts = data.map((d, i) => [i * step, h - (d / max) * (h - 24)] as const);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`ac-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" y1={h * g} x2={w} y2={h * g} stroke="#ECE7DB" strokeWidth="1" />
        ))}
        <motion.path
          d={area}
          fill={`url(#ac-${color.slice(1)})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        {pts.map((p, i) => (
          <motion.circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r="4"
            fill="#fff"
            stroke={color}
            strokeWidth="3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.05 }}
          />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-[11.5px] font-semibold text-muted">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

export function DonutChart({
  segments,
  size = 168,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = size / 2 - 16;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg width={size} height={size} className="-rotate-90 shrink-0">
        {segments.map((s) => {
          const len = (s.value / total) * c;
          const el = (
            <motion.circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={`${len} ${c - len}`}
              initial={{ strokeDashoffset: -offset + c }}
              animate={{ strokeDashoffset: -offset }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="flex flex-col gap-2.5">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full" style={{ background: s.color }} />
            <span className="text-[13.5px] text-canopy-70">{s.label}</span>
            <span className="ml-auto font-display text-[14px] font-extrabold text-canopy">
              {Math.round((s.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Table({
  columns,
  rows,
}: {
  columns: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="-mx-5 overflow-x-auto px-5">
      <table className="w-full min-w-[560px] border-collapse">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c}
                className="border-b border-hair pb-3 text-left text-[12px] font-bold uppercase tracking-wide text-muted"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <motion.tr
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group"
            >
              {r.map((cell, j) => (
                <td
                  key={j}
                  className="border-b border-hair py-3.5 text-[13.5px] text-canopy transition-colors group-hover:bg-cream"
                >
                  {cell}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Pill({
  children,
  tone = "leaf",
}: {
  children: ReactNode;
  tone?: "leaf" | "sun" | "clay" | "sky" | "muted";
}) {
  const tones = {
    leaf: "bg-wash text-leaf-dark",
    sun: "bg-sun-wash text-[#9a6608]",
    clay: "bg-clay-wash text-clay",
    sky: "bg-sky-wash text-sky",
    muted: "bg-cream text-muted",
  } as const;
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[12px] font-bold", tones[tone])}>
      {children}
    </span>
  );
}
