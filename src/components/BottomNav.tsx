import { NavLink, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { Home, Sparkles, Sprout, Store, User } from "lucide-react";
import { gentle, layoutIds, press } from "@/motion/springs";
import { cn } from "@/lib/cn";

const items = [
  { to: "/", icon: Home, label: "Home", end: true },
  { to: "/farm", icon: Sprout, label: "My Farm" },
  { to: "/assistant", icon: Sparkles, label: "AI", center: true },
  { to: "/market", icon: Store, label: "Market" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();

  return (
    <nav className="pointer-events-auto absolute inset-x-0 bottom-0 z-40 px-3 pb-3">
      <div className="relative flex items-end justify-between rounded-[26px] bg-surface/92 px-2 pt-2 pb-1.5 shadow-[0_-6px_28px_rgba(15,61,46,0.12)] backdrop-blur-xl">
        {items.map(({ to, icon: Icon, label, end, center }) => {
          const active = end ? pathname === to : pathname.startsWith(to);

          if (center) {
            return (
              <NavLink key={to} to={to} className="relative -mt-7 flex flex-1 flex-col items-center">
                <motion.span
                  whileTap={reduce ? undefined : { scale: 0.9 }}
                  whileHover={reduce ? undefined : { y: -2 }}
                  transition={press}
                  className={cn(
                    "grid h-[58px] w-[58px] place-items-center rounded-[20px] shadow-[0_12px_26px_-8px_rgba(27,122,69,0.75)]",
                    active
                      ? "bg-gradient-to-br from-sprout to-leaf-dark"
                      : "bg-gradient-to-br from-leaf to-leaf-dark",
                  )}
                >
                  {/* the assistant badge breathes so the AI entry point never feels dormant */}
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-[20px] border-2 border-sprout"
                    animate={reduce ? {} : { scale: [1, 1.22], opacity: [0.55, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                  />
                  <Icon className="h-[26px] w-[26px] text-white" strokeWidth={2.2} />
                </motion.span>
                <span
                  className={cn(
                    "mt-1 text-[11px] font-bold",
                    active ? "text-leaf-dark" : "text-muted",
                  )}
                >
                  {label}
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={to}
              to={to}
              className="relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5"
            >
              {active && (
                <motion.span
                  layoutId={layoutIds.navPill}
                  transition={gentle}
                  className="absolute inset-x-1.5 inset-y-0.5 -z-10 rounded-2xl bg-wash"
                />
              )}
              <motion.span
                animate={active ? { y: -1, scale: 1.06 } : { y: 0, scale: 1 }}
                transition={press}
              >
                <Icon
                  className={cn("h-[22px] w-[22px]", active ? "text-leaf-dark" : "text-muted")}
                  strokeWidth={active ? 2.5 : 2}
                />
              </motion.span>
              <span
                className={cn(
                  "text-[11px] font-bold leading-none",
                  active ? "text-leaf-dark" : "text-muted",
                )}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
