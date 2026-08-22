import { motion } from "motion/react";
import { ArrowDownLeft, ArrowUpRight, Clock, Wallet } from "lucide-react";
import { Card, CountUp, ScreenHeader, SectionTitle, Tag } from "@/components/ui";
import { gentle } from "@/motion/springs";
import { earnings } from "@/data/app";
import { cn } from "@/lib/cn";

/** Six months of income, drawn as a small bar chart that grows on mount. */
const months = [
  { m: "Apr", v: 22 }, { m: "May", v: 31 }, { m: "Jun", v: 18 },
  { m: "Jul", v: 44 }, { m: "Aug", v: 39 }, { m: "Sep", v: 48.5 },
];

export default function Earnings() {
  const max = Math.max(...months.map((m) => m.v));

  return (
    <div className="min-h-dvh">
      <ScreenHeader title="My earnings" subtitle="Digital payments from every sale" />

      <div className="px-5 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={gentle}
          className="rounded-[28px] bg-gradient-to-br from-canopy to-[#17604A] p-5 text-white"
        >
          <div className="flex items-center gap-2 text-[13px] text-white/70">
            <Wallet className="h-4 w-4" /> Total earned this season
          </div>
          <CountUp
            to={earnings.total}
            prefix="₹"
            className="mt-2 block font-display text-[42px] font-extrabold leading-none"
          />

          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { label: "Pending", value: earnings.pending, tone: "text-sun" },
              { label: "Completed", value: earnings.completed, tone: "text-sprout" },
              { label: "This month", value: earnings.month, tone: "text-white" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/12 px-2 py-3 text-center">
                <p className={cn("font-display text-[15px] font-extrabold", s.tone)}>
                  ₹{(s.value / 1000).toFixed(1)}k
                </p>
                <p className="mt-0.5 text-[10.5px] text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-6">
          <SectionTitle title="Income by month" />
          <Card>
            <div className="flex h-36 items-end justify-between gap-2.5">
              {months.map((m, i) => (
                <div key={m.m} className="flex flex-1 flex-col items-center gap-2">
                  <motion.div
                    className={cn(
                      "w-full rounded-t-xl rounded-b-md",
                      i === months.length - 1 ? "bg-leaf" : "bg-wash-deep",
                    )}
                    initial={{ height: 0 }}
                    animate={{ height: `${(m.v / max) * 108}px` }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <span className="text-[11.5px] font-bold text-muted">{m.m}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <SectionTitle title="Transactions" />
          <Card className="py-2">
            {earnings.transactions.map((t, i) => {
              const credit = t.amount > 0;
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 border-b border-hair py-3.5 last:border-0"
                >
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-2xl",
                      credit ? "bg-wash text-leaf" : "bg-clay-wash text-clay",
                    )}
                  >
                    {credit ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14.5px] font-bold text-canopy">{t.label}</p>
                    <p className="text-[12px] text-muted">{t.date}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={cn(
                        "font-display text-[15.5px] font-extrabold",
                        credit ? "text-canopy" : "text-clay",
                      )}
                    >
                      {credit ? "+" : "−"}₹{Math.abs(t.amount).toLocaleString("en-IN")}
                    </p>
                    <Tag tone={t.status === "Completed" ? "wash" : "sun"} className="mt-1 px-2 py-0.5 text-[10.5px]">
                      {t.status === "Pending" && <Clock className="h-3 w-3" />}
                      {t.status}
                    </Tag>
                  </div>
                </motion.div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}
