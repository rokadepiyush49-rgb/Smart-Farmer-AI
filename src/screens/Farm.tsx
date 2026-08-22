import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  CalendarDays, CheckCircle2, ClipboardList, Droplets, Layers, MapPin,
  Ruler, ScanLine, Shield, Sprout, Store, Wheat,
} from "lucide-react";
import { Card, Rise, RiseGroup, SectionTitle, Tag } from "@/components/ui";
import { CropGlyph } from "@/components/CropGlyph";
import { Pressable, PressableCard } from "@/motion/Pressable";
import { gentle, pop } from "@/motion/springs";
import { farmer } from "@/data/app";
import { cn } from "@/lib/cn";

const lifecycle = [
  { label: "Plan", icon: ClipboardList },
  { label: "Grow", icon: Sprout },
  { label: "Protect", icon: Shield },
  { label: "Harvest", icon: Wheat },
  { label: "Sell", icon: Store },
];

const activities = [
  { done: true, label: "Sowing completed", date: "18 Nov", note: "HD-2967 variety, 40 kg/acre" },
  { done: true, label: "First irrigation", date: "3 Dec", note: "Crown root initiation stage" },
  { done: true, label: "Nitrogen first split", date: "5 Dec", note: "Urea 45 kg/acre" },
  { done: false, label: "Nitrogen second split", date: "Due this week", note: "Urea 40 kg/acre after irrigation" },
  { done: false, label: "Second irrigation", date: "Due Thursday", note: "About 22 mm" },
];

export default function Farm() {
  const navigate = useNavigate();

  return (
    <div className="px-5 pt-6 pb-32">
      <h1 className="font-display text-[26px] font-extrabold leading-tight text-canopy">My farm</h1>
      <p className="mt-1 flex items-center gap-1.5 text-[13.5px] font-semibold text-leaf-dark">
        <MapPin className="h-3.5 w-3.5" /> {farmer.district}
      </p>

      {/* ------------------------------------------------------- hero card */}
      <Card className="mt-5 bg-gradient-to-br from-canopy to-[#17604A] text-white">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[20px] bg-white/12">
            <CropGlyph crop={farmer.currentCrop} className="h-10 w-10" />
          </span>
          <div className="flex-1">
            <Tag tone="canopy" className="bg-white/15 text-white">Current crop</Tag>
            <p className="mt-1.5 font-display text-[24px] font-extrabold capitalize leading-tight">
              {farmer.currentCrop}
            </p>
            <p className="text-[13px] text-white/70">
              Sown {farmer.sownOn} · Harvest around {farmer.expectedHarvest}
            </p>
          </div>
        </div>

        {/* growth progress: a season told as a single filling bar */}
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-[12.5px] font-semibold text-white/75">
            <span>{farmer.stage} stage</span>
            <span>38% of season</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/15">
            <motion.div
              className="h-full rounded-full bg-sprout"
              initial={{ width: 0 }}
              animate={{ width: "38%" }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            />
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------------- lifecycle */}
      <div className="mt-7">
        <SectionTitle title="Season lifecycle" />
        <Card className="px-4 py-5">
          <div className="flex items-start justify-between">
            {lifecycle.map((s, i) => {
              const done = i < farmer.stageIndex;
              const active = i === farmer.stageIndex;
              return (
                <div key={s.label} className="relative flex flex-1 flex-col items-center">
                  {i < lifecycle.length - 1 && (
                    <div className="absolute left-1/2 top-6 h-[3px] w-full bg-hair">
                      <motion.div
                        className="h-full bg-leaf"
                        initial={{ width: 0 }}
                        animate={{ width: done ? "100%" : "0%" }}
                        transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                      />
                    </div>
                  )}
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15 + i * 0.09, ...pop }}
                    className={cn(
                      "relative z-10 grid h-12 w-12 place-items-center rounded-2xl",
                      done && "bg-leaf text-white",
                      active && "bg-sun text-canopy",
                      !done && !active && "bg-cream text-muted",
                    )}
                  >
                    {active && (
                      <motion.span
                        className="absolute inset-0 rounded-2xl border-2 border-sun"
                        animate={{ scale: [1, 1.3], opacity: [0.7, 0] }}
                        transition={{ duration: 1.9, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                    <s.icon className="h-5 w-5" />
                  </motion.span>
                  <span
                    className={cn(
                      "mt-2 text-[11.5px] font-bold",
                      active ? "text-canopy" : done ? "text-leaf" : "text-muted",
                    )}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ------------------------------------------------------ farm facts */}
      <div className="mt-7">
        <SectionTitle title="Farm details" action="Edit" />
        <RiseGroup className="grid grid-cols-2 gap-3">
          {[
            { icon: Ruler, label: "Land area", value: `${farmer.landAcres} acres` },
            { icon: Layers, label: "Soil type", value: farmer.soil },
            { icon: Wheat, label: "Previous crop", value: farmer.previousCrop },
            { icon: CalendarDays, label: "Crop stage", value: farmer.stage },
          ].map((f) => (
            <Rise key={f.label}>
              <Card className="h-full p-4">
                <f.icon className="h-5 w-5 text-leaf" />
                <p className="mt-2.5 text-[11.5px] font-bold uppercase tracking-wide text-muted">
                  {f.label}
                </p>
                <p className="mt-0.5 font-display text-[15px] font-extrabold leading-tight text-canopy">
                  {f.value}
                </p>
              </Card>
            </Rise>
          ))}
        </RiseGroup>
      </div>

      {/* ------------------------------------------------------ activities */}
      <div className="mt-7">
        <SectionTitle title="Farming activities" />
        <Card className="py-3">
          {activities.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, ...gentle }}
              className="flex items-start gap-3 border-b border-hair py-3 last:border-0"
            >
              <span
                className={cn(
                  "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full",
                  a.done ? "bg-wash" : "bg-sun-wash",
                )}
              >
                {a.done ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-leaf" />
                ) : (
                  <Droplets className="h-4 w-4 text-[#9a6608]" />
                )}
              </span>
              <div className="flex-1">
                <p
                  className={cn(
                    "text-[14.5px] font-bold",
                    a.done ? "text-muted line-through" : "text-canopy",
                  )}
                >
                  {a.label}
                </p>
                <p className="text-[12.5px] text-muted">{a.note}</p>
              </div>
              <span className="shrink-0 text-[12px] font-semibold text-muted">{a.date}</span>
            </motion.div>
          ))}
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Pressable variant="tonal" size="lg" onClick={() => navigate("/scan")}>
          <ScanLine className="h-4.5 w-4.5" /> Scan crop
        </Pressable>
        <Pressable size="lg" onClick={() => navigate("/market")}>
          <Store className="h-4.5 w-4.5" /> Sell crop
        </Pressable>
      </div>

      <PressableCard
        onClick={() => navigate("/orders/SF-2481")}
        className="mt-3 w-full rounded-[24px] bg-surface p-4 shadow-soft"
      >
        <p className="text-[12px] font-bold uppercase tracking-wide text-muted">Active order</p>
        <p className="mt-1 font-display text-[16px] font-extrabold text-canopy">
          Wheat · Anandvan Foods · 8 tons
        </p>
        <p className="mt-0.5 text-[13px] text-leaf">In transit — track your order →</p>
      </PressableCard>
    </div>
  );
}
