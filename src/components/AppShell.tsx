import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { BottomNav } from "./BottomNav";
import { screenVariants } from "@/motion/springs";

/**
 * The phone. On a handset this is simply the viewport; on a desktop it becomes
 * a device frame so the mobile design can be reviewed and screenshotted.
 */
export function AppShell() {
  const location = useLocation();
  const scroller = useRef<HTMLDivElement>(null);

  // Every navigation starts at the top, the way a native push does.
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="flex min-h-dvh justify-center bg-[#eef1ec] lg:items-center lg:py-10">
      <div className="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-cream grain lg:h-[880px] lg:rounded-[46px] lg:shadow-[0_40px_90px_-30px_rgba(15,61,46,0.45)] lg:ring-[10px] lg:ring-canopy/90">
        <div ref={scroller} className="no-scrollbar flex-1 overflow-y-auto overscroll-contain">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
