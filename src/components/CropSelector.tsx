import { motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { CropGlyph } from "./CropGlyph";
import { crops } from "@/data/app";
import type { CropId } from "./CropGlyph";
import { gentle, layoutIds, press } from "@/motion/springs";
import { cn } from "@/lib/cn";

/**
 * Visual crop switcher. Selecting a crop re-drives the whole dashboard, so the
 * selected state has to be unmistakable: a filled token that the shared-layout
 * pill slides into, plus a lift and a scale on the glyph itself.
 */
export function CropSelector({
  value,
  onChange,
}: {
  value: CropId;
  onChange: (c: CropId) => void;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-2 pt-1">
      {crops.map((crop) => {
        const active = crop.id === value;
        return (
          <motion.button
            key={crop.id}
            onClick={() => onChange(crop.id)}
            whileTap={reduce ? undefined : { scale: 0.92 }}
            transition={press}
            className="relative flex w-[72px] shrink-0 flex-col items-center gap-1.5 outline-none"
            aria-pressed={active}
          >
            <div className="relative grid h-[68px] w-[68px] place-items-center">
              {active && (
                <motion.span
                  layoutId={layoutIds.cropPill}
                  transition={gentle}
                  className="absolute inset-0 rounded-[22px] bg-leaf shadow-[0_12px_24px_-10px_rgba(27,122,69,0.9)]"
                />
              )}
              <span
                className={cn(
                  "absolute inset-0 rounded-[22px] transition-colors",
                  active ? "bg-transparent" : "bg-surface shadow-soft",
                )}
              />
              <motion.span
                animate={active ? { scale: 1.1, rotate: -4 } : { scale: 1, rotate: 0 }}
                transition={press}
                className="relative"
              >
                <CropGlyph crop={crop.id} className="h-9 w-9" />
              </motion.span>
            </div>
            <span
              className={cn(
                "text-[12px] font-bold leading-none",
                active ? "text-leaf-dark" : "text-muted",
              )}
            >
              {crop.name}
            </span>
          </motion.button>
        );
      })}

      <motion.button
        whileTap={reduce ? undefined : { scale: 0.92 }}
        transition={press}
        className="flex w-[72px] shrink-0 flex-col items-center gap-1.5 outline-none"
        aria-label="Add another crop"
      >
        <span className="grid h-[68px] w-[68px] place-items-center rounded-[22px] border-2 border-dashed border-hair bg-surface/50">
          <Plus className="h-6 w-6 text-muted" />
        </span>
        <span className="text-[12px] font-bold leading-none text-muted">Add</span>
      </motion.button>
    </div>
  );
}
