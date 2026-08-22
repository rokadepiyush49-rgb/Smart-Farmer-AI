import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  Bell, Camera, ChevronRight, Droplets, IndianRupee, Leaf, MapPin,
  ScanLine, Sparkles, Stethoscope, TrendingUp, UserRound, Wind,
} from "lucide-react";
import { CropSelector } from "@/components/CropSelector";
import { CropGlyph } from "@/components/CropGlyph";
import type { CropId } from "@/components/CropGlyph";
import { WeatherIcon } from "@/components/WeatherIcon";
import {
  Card, ConfidenceRing, Rise, RiseGroup, SectionTitle, Tag,
} from "@/components/ui";
import { Pressable, PressableCard } from "@/motion/Pressable";
import { press } from "@/motion/springs";
import { advisories, cropHealth, crops, farmer, weather } from "@/data/app";
import { cn } from "@/lib/cn";

const quickActions = [
  { icon: Leaf, title: "Crop Recommendation", body: "Find the most profitable crop for your farm.", to: "/recommend", tint: "bg-wash text-leaf-dark" },
  { icon: ScanLine, title: "Disease Detection", body: "Photograph a leaf and identify the problem.", to: "/scan", tint: "bg-clay-wash text-clay" },
  { icon: WeatherTint, title: "Weather Advisory", body: "Farming advice from this week's weather.", to: "/weather", tint: "bg-sky-wash text-sky" },
  { icon: Stethoscope, title: "Expert Consultation", body: "Talk to an agricultural expert today.", to: "/experts", tint: "bg-sun-wash text-[#9a6608]" },
];

function WeatherTint(props: { className?: string }) {
  return <WeatherIcon icon="sun" className={props.className} />;
}

const advisoryStyle = {
  weather:    { tint: "bg-sky-wash text-sky", emoji: "🌧" },
  crop:       { tint: "bg-wash text-leaf-dark", emoji: "🌱" },
  market:     { tint: "bg-sun-wash text-[#9a6608]", emoji: "💰" },
  irrigation: { tint: "bg-sky-wash text-sky", emoji: "💧" },
} as const;

export default function Home() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [crop, setCrop] = useState<CropId>(farmer.currentCrop);

  const health = cropHealth[crop];
  const cropName = crops.find((c) => c.id === crop)?.name ?? "";
  const healthTone =
    health.status === "Healthy" ? "#1B7A45" : health.status === "Watch" ? "#F5A524" : "#E5484D";

  return (
    <div className="px-5 pt-5 pb-32">
      {/* ---------------------------------------------------------- header */}
      <header className="mb-5 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-[24px] font-extrabold leading-tight text-canopy"
          >
            Good morning, {farmer.name} 👋
          </motion.p>
          <p className="mt-0.5 text-[14px] text-muted">Your farm is looking good today</p>
          <div className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold text-leaf-dark">
            <MapPin className="h-3.5 w-3.5" />
            {farmer.district}
          </div>
        </div>

        <Pressable variant="surface" size="sm" ripple={false} className="h-11 w-11 shrink-0 px-0" aria-label="Notifications">
          <span className="relative">
            <Bell className="h-5 w-5" />
            <motion.span
              className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-clay ring-2 ring-white"
              animate={reduce ? {} : { scale: [1, 1.35, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </span>
        </Pressable>

        <PressableCard
          onClick={() => navigate("/profile")}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-canopy text-white shadow-soft"
          aria-label="Profile"
        >
          <UserRound className="h-5 w-5" />
        </PressableCard>
      </header>

      {/* -------------------------------------------------- weather strip */}
      <PressableCard onClick={() => navigate("/weather")} className="mb-5 w-full">
        <div className="flex items-center gap-3 rounded-[20px] bg-gradient-to-r from-canopy to-[#175943] px-4 py-3.5 text-white shadow-soft">
          <WeatherIcon icon="sun" className="h-8 w-8" animate />
          <div className="flex-1 text-left">
            <p className="font-display text-[18px] font-extrabold leading-none">
              {weather.temp}°C · {weather.condition}
            </p>
            <p className="mt-1 text-[12.5px] text-white/70">
              Rain {weather.rainChance}% · Humidity {weather.humidity}%
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-white/60" />
        </div>
      </PressableCard>

      {/* ------------------------------------------------- crop selector */}
      <SectionTitle title="Your crops" />
      <CropSelector value={crop} onChange={setCrop} />

      {/* -------------------------------------------------- quick actions */}
      <div className="mt-6">
        <SectionTitle title="What do you need?" />
        <RiseGroup className="grid grid-cols-2 gap-3">
          {quickActions.map(({ icon: Icon, title, body, to, tint }) => (
            <Rise key={title}>
              <PressableCard
                onClick={() => navigate(to)}
                className="h-full w-full rounded-[24px] bg-surface p-4 shadow-soft"
              >
                <span className={cn("mb-3 grid h-12 w-12 place-items-center rounded-2xl", tint)}>
                  <Icon className="h-6 w-6" />
                </span>
                <p className="font-display text-[15.5px] font-extrabold leading-tight text-canopy">
                  {title}
                </p>
                <p className="mt-1 text-[12.5px] leading-snug text-muted">{body}</p>
              </PressableCard>
            </Rise>
          ))}
        </RiseGroup>
      </div>

      {/* ----------------------------------------------- primary AI action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 240, damping: 26 }}
        className="mt-7 overflow-hidden rounded-[28px] bg-gradient-to-br from-leaf to-[#0F5C34] p-5 text-white shadow-[0_20px_40px_-18px_rgba(15,92,52,0.9)]"
      >
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <Tag tone="canopy" className="mb-2.5 bg-white/15 text-white">
              <Sparkles className="h-3.5 w-3.5" /> AI Computer Vision
            </Tag>
            <h3 className="font-display text-[23px] font-extrabold leading-tight">Check your crop</h3>
            <p className="mt-1 max-w-[210px] text-[13.5px] leading-snug text-white/80">
              One photo tells you what is wrong and what to do about it.
            </p>
          </div>
          <ScanningLeaf />
        </div>

        {/* three-step explainer — shows the farmer the whole flow before they start */}
        <div className="mt-4 flex items-center gap-1.5">
          {[
            { icon: Camera, label: "Take a photo" },
            { icon: Sparkles, label: "AI analyses" },
            { icon: Leaf, label: "Get advice" },
          ].map(({ icon: Icon, label }, i, arr) => (
            <div key={label} className="flex flex-1 items-center gap-1.5">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.12, ...press }}
                className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-white/12 px-1 py-2.5"
              >
                <Icon className="h-4 w-4" />
                <span className="text-center text-[10.5px] font-bold leading-tight">{label}</span>
              </motion.div>
              {i < arr.length - 1 && (
                <motion.span
                  className="h-1 w-1 shrink-0 rounded-full bg-white/50"
                  animate={reduce ? {} : { opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }}
                />
              )}
            </div>
          ))}
        </div>

        <Pressable variant="light" size="lg" block className="mt-4" onClick={() => navigate("/scan")}>
          <Camera className="h-5 w-5" /> Analyse my crop
        </Pressable>
      </motion.div>

      {/* ------------------------------------------------------ crop health */}
      <div className="mt-7">
        <SectionTitle title="Your crop health" action="History" onAction={() => navigate("/farm")} />
        <Card>
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-wash">
              <CropGlyph crop={crop} className="h-8 w-8" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[18px] font-extrabold text-canopy">{cropName}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <Tag tone={health.status === "Healthy" ? "wash" : health.status === "Watch" ? "sun" : "clay"}>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: healthTone }}
                  />
                  {health.status}
                </Tag>
                <span className="text-[12px] text-muted">Scanned {health.scannedAgo}</span>
              </div>
            </div>
            <ConfidenceRing value={health.confidence} tone={healthTone} label="AI" />
          </div>

          <p className="mt-4 rounded-2xl bg-cream px-3.5 py-3 text-[13.5px] leading-snug text-canopy-70">
            {health.note}
          </p>

          {health.issue && (
            <div className="mt-2.5 flex items-center gap-2 rounded-2xl bg-clay-wash px-3.5 py-3">
              <span className="text-base">⚠️</span>
              <p className="flex-1 text-[13.5px] font-semibold text-clay">{health.issue}</p>
              <ChevronRight className="h-4 w-4 text-clay" />
            </div>
          )}

          <Pressable variant="tonal" size="md" block className="mt-3" onClick={() => navigate("/scan")}>
            <ScanLine className="h-4.5 w-4.5" /> Scan this crop again
          </Pressable>
        </Card>
      </div>

      {/* --------------------------------------------------- daily advisory */}
      <div className="mt-7">
        <SectionTitle title="Today's recommendations" />
        <RiseGroup className="flex flex-col gap-3">
          {advisories.map((a) => {
            const s = advisoryStyle[a.kind];
            return (
              <Rise key={a.id}>
                <PressableCard
                  onClick={() => a.to && navigate(a.to)}
                  className="w-full rounded-[24px] bg-surface p-4 shadow-soft"
                >
                  <div className="flex gap-3">
                    <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-lg", s.tint)}>
                      {s.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[16px] font-extrabold leading-tight text-canopy">
                        {a.title}
                      </p>
                      <p className="mt-1 text-[13px] leading-snug text-muted">{a.body}</p>
                      <p className="mt-2 rounded-xl bg-cream px-3 py-2 text-[13px] font-semibold leading-snug text-leaf-dark">
                        {a.action}
                      </p>
                      {a.to && (
                        <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-bold text-leaf">
                          {a.kind === "market" ? "View market" : "Open"}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </PressableCard>
              </Rise>
            );
          })}
        </RiseGroup>
      </div>

      {/* ------------------------------------------------------ market peek */}
      <div className="mt-7">
        <SectionTitle title="Sell your crop" action="All buyers" onAction={() => navigate("/market")} />
        <PressableCard
          onClick={() => navigate("/market")}
          className="w-full rounded-[24px] bg-surface p-4 shadow-soft"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sun-wash">
              <IndianRupee className="h-6 w-6 text-[#9a6608]" />
            </span>
            <div className="flex-1 text-left">
              <p className="font-display text-[16px] font-extrabold text-canopy">
                Wheat ₹2,450 / quintal
              </p>
              <p className="text-[12.5px] text-muted">4 verified buyers near Wardha</p>
            </div>
            <Tag tone="wash">
              <TrendingUp className="h-3.5 w-3.5" /> +6%
            </Tag>
          </div>
        </PressableCard>
      </div>

      {/* --------------------------------------------------- weather detail */}
      <div className="mt-7 mb-6">
        <SectionTitle title="This week" action="7-day" onAction={() => navigate("/weather")} />
        <Card className="pb-4">
          <div className="mb-4 flex items-end gap-4">
            <div>
              <p className="font-display text-[42px] font-extrabold leading-none text-canopy">
                {weather.temp}°
              </p>
              <p className="mt-1 text-[13.5px] font-semibold text-muted">{weather.condition}</p>
            </div>
            <div className="ml-auto flex gap-4 text-right">
              <Metric icon={Droplets} value={`${weather.rainChance}%`} label="Rain" />
              <Metric icon={Wind} value={`${weather.wind}`} label="km/h" />
            </div>
          </div>

          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
            {weather.week.map((d, i) => (
              <motion.div
                key={d.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  "flex w-[58px] shrink-0 flex-col items-center gap-1.5 rounded-2xl py-2.5",
                  i === 0 ? "bg-wash" : "bg-cream",
                )}
              >
                <span className="text-[11.5px] font-bold text-muted">{d.day}</span>
                <WeatherIcon icon={d.icon} className="h-5 w-5" />
                <span className="text-[13px] font-extrabold text-canopy">{d.hi}°</span>
                <span className="text-[10.5px] text-sky">{d.rain}%</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 flex gap-2.5 rounded-2xl bg-wash px-3.5 py-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wide text-leaf">AI farming advice</p>
              <p className="mt-0.5 text-[13.5px] leading-snug text-canopy-70">{weather.advice}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Droplets;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <Icon className="h-4 w-4 text-muted" />
      <span className="font-display text-[15px] font-extrabold text-canopy">{value}</span>
      <span className="text-[10.5px] text-muted">{label}</span>
    </div>
  );
}

/** The leaf under the scan-line: a slow sweep that hints at what the CV model does. */
function ScanningLeaf() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-[86px] w-[86px] shrink-0 overflow-hidden rounded-[22px] bg-white/12">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path
          d="M50 84c-17-6-28-21-28-39 0-12 7-23 18-29 5 12 15 17 24 23 10 7 14 15 12 25-2 11-12 18-26 20z"
          fill="rgba(255,255,255,0.9)"
        />
        <path d="M50 84c-3-16-2-32 6-48" stroke="#1B7A45" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
      {!reduce && (
        <motion.div
          className="absolute inset-x-0 h-[3px] bg-sprout shadow-[0_0_16px_4px_rgba(52,199,123,0.9)]"
          animate={{ top: ["6%", "88%", "6%"] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
