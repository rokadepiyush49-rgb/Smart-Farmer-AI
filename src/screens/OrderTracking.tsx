import { motion } from "motion/react";
import { CheckCircle2, MessageCircle, Phone, Truck } from "lucide-react";
import { Card, ScreenHeader, Tag } from "@/components/ui";
import { Pressable } from "@/motion/Pressable";
import { gentle, pop } from "@/motion/springs";
import { order } from "@/data/app";
import { cn } from "@/lib/cn";

export default function OrderTracking() {
  const doneCount = order.steps.filter((s) => s.done).length;

  return (
    <div className="min-h-dvh">
      <ScreenHeader title={`Order ${order.id}`} subtitle={`${order.crop} · ${order.buyer}`} />

      <div className="px-5 pb-32">
        {/* summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={gentle}
          className="rounded-[28px] bg-gradient-to-br from-canopy to-[#17604A] p-5 text-white"
        >
          <Tag tone="canopy" className="bg-white/15 text-white">
            <motion.span
              className="h-2 w-2 rounded-full bg-sprout"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            In transit
          </Tag>
          <p className="mt-3 font-display text-[34px] font-extrabold leading-none">
            ₹{order.amount.toLocaleString("en-IN")}
          </p>
          <p className="mt-1.5 text-[13.5px] text-white/70">
            {order.quantity} of {order.crop.toLowerCase()} · {order.buyer}
          </p>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/12 px-4 py-3">
            <Truck className="h-5 w-5" />
            <div className="flex-1">
              <p className="text-[13.5px] font-bold">Arriving in about 2 hours</p>
              <p className="text-[12px] text-white/60">MH-32 AB 4471 · Vidarbha Logistics</p>
            </div>
          </div>
        </motion.div>

        {/* timeline */}
        <div className="mt-6">
          <div className="mb-3 flex items-end justify-between px-1">
            <h2 className="font-display text-[19px] font-extrabold text-canopy">Your wheat order</h2>
            <span className="text-[13px] font-semibold text-muted">
              {doneCount} of {order.steps.length} done
            </span>
          </div>

          <Card className="px-4 py-5">
            <div className="relative">
              {/* the rail fills to exactly where the order has reached */}
              <div className="absolute bottom-4 left-[19px] top-4 w-[3px] rounded-full bg-hair">
                <motion.div
                  className="w-full rounded-full bg-leaf"
                  initial={{ height: 0 }}
                  animate={{ height: `${(doneCount / (order.steps.length - 1)) * 100}%` }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
                />
              </div>

              {order.steps.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.09, ...gentle }}
                  className="relative flex gap-4 pb-6 last:pb-0"
                >
                  <motion.span
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.09, ...pop }}
                    className={cn(
                      "relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full ring-4 ring-white",
                      s.done && "bg-leaf text-white",
                      s.current && "bg-sun text-canopy",
                      !s.done && !s.current && "bg-cream text-muted",
                    )}
                  >
                    {s.current && (
                      <motion.span
                        className="absolute inset-0 rounded-full border-2 border-sun"
                        animate={{ scale: [1, 1.45], opacity: [0.75, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                    {s.done ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : s.current ? (
                      <Truck className="h-4.5 w-4.5" />
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full bg-hair" />
                    )}
                  </motion.span>

                  <div className="pt-1.5">
                    <p
                      className={cn(
                        "font-display text-[15.5px] font-extrabold leading-tight",
                        s.done || s.current ? "text-canopy" : "text-muted",
                      )}
                    >
                      {s.label}
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-muted">{s.note}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Pressable variant="tonal" size="lg">
            <Phone className="h-4.5 w-4.5" /> Call driver
          </Pressable>
          <Pressable variant="tonal" size="lg">
            <MessageCircle className="h-4.5 w-4.5" /> Message buyer
          </Pressable>
        </div>
      </div>
    </div>
  );
}
