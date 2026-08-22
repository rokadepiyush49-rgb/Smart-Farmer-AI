import { motion } from "motion/react";
import { Droplets, Sparkles, Sun, Wind } from "lucide-react";
import { Card, Rise, RiseGroup, ScreenHeader, SectionTitle } from "@/components/ui";
import { WeatherIcon } from "@/components/WeatherIcon";
import { weather } from "@/data/app";
import { gentle } from "@/motion/springs";
import { cn } from "@/lib/cn";

const hourly = [
  { t: "Now", temp: 24, icon: "sun" },
  { t: "11 AM", temp: 26, icon: "sun" },
  { t: "1 PM", temp: 28, icon: "sun" },
  { t: "3 PM", temp: 27, icon: "cloud" },
  { t: "5 PM", temp: 24, icon: "cloud" },
  { t: "7 PM", temp: 21, icon: "cloud" },
  { t: "9 PM", temp: 19, icon: "cloud" },
] as const;

const guidance = [
  {
    emoji: "🚿",
    title: "Spraying window",
    body: "Open until 11 AM today. Wind is 9 km/h — low enough for even coverage.",
    tone: "bg-wash",
  },
  {
    emoji: "💧",
    title: "Irrigation",
    body: "Skip today. Tuesday's rain should cover your crop's needs — irrigate about 22 mm on Thursday instead.",
    tone: "bg-sky-wash",
  },
  {
    emoji: "🌾",
    title: "Field work",
    body: "Good conditions for the nitrogen second split. Apply before Tuesday so rain carries it in.",
    tone: "bg-sun-wash",
  },
];

export default function Weather() {
  return (
    <div className="min-h-dvh">
      <ScreenHeader title="Weather advisory" subtitle="Wardha, Maharashtra" />

      <div className="px-5 pb-32">
        {/* hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={gentle}
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-canopy to-[#17604A] px-5 py-6 text-white"
        >
          <motion.span
            className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-sun/25 blur-2xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative flex items-center gap-4">
            <WeatherIcon icon="sun" className="h-16 w-16" animate />
            <div>
              <p className="font-display text-[52px] font-extrabold leading-none">{weather.temp}°</p>
              <p className="mt-1 text-[15px] font-semibold text-white/80">{weather.condition}</p>
              <p className="text-[13px] text-white/60">Feels like {weather.feels}°</p>
            </div>
          </div>

          <div className="relative mt-5 grid grid-cols-3 gap-2">
            {[
              { icon: Droplets, label: "Rain", value: `${weather.rainChance}%` },
              { icon: Sun, label: "Humidity", value: `${weather.humidity}%` },
              { icon: Wind, label: "Wind", value: `${weather.wind} km/h` },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl bg-white/12 px-2 py-3 text-center">
                <m.icon className="mx-auto h-4 w-4 text-white/70" />
                <p className="mt-1 font-display text-[15px] font-extrabold">{m.value}</p>
                <p className="text-[11px] text-white/60">{m.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* hourly */}
        <div className="mt-6">
          <SectionTitle title="Today" />
          <Card className="px-3 py-4">
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {hourly.map((h, i) => (
                <motion.div
                  key={h.t}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "flex w-[62px] shrink-0 flex-col items-center gap-2 rounded-2xl py-3",
                    i === 0 ? "bg-wash" : "bg-cream",
                  )}
                >
                  <span className="text-[11.5px] font-bold text-muted">{h.t}</span>
                  <WeatherIcon icon={h.icon} className="h-5 w-5" />
                  <span className="font-display text-[15px] font-extrabold text-canopy">{h.temp}°</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* 7-day */}
        <div className="mt-6">
          <SectionTitle title="Next 7 days" />
          <Card className="py-2">
            {weather.week.map((d, i) => (
              <motion.div
                key={d.day}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 border-b border-hair py-3 last:border-0"
              >
                <span className="w-14 text-[14px] font-bold text-canopy">{d.day}</span>
                <WeatherIcon icon={d.icon} className="h-5 w-5" />
                <span className="w-12 text-[12.5px] font-semibold text-sky">{d.rain}%</span>
                {/* temperature range drawn as a bar so the week reads at a glance */}
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-hair">
                  <motion.div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky to-sun"
                    initial={{ width: 0 }}
                    animate={{ width: `${((d.hi - d.lo) / 16) * 100}%`, left: `${(d.lo - 12) * 6}%` }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.6 }}
                  />
                </div>
                <span className="w-14 text-right text-[13.5px] font-extrabold text-canopy">
                  {d.hi}° <span className="font-semibold text-muted">{d.lo}°</span>
                </span>
              </motion.div>
            ))}
          </Card>
        </div>

        {/* advice */}
        <div className="mt-6">
          <SectionTitle title="AI farming advice" />
          <RiseGroup className="flex flex-col gap-3">
            {guidance.map((g) => (
              <Rise key={g.title}>
                <Card className="p-4">
                  <div className="flex gap-3">
                    <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-lg", g.tone)}>
                      {g.emoji}
                    </span>
                    <div>
                      <p className="font-display text-[15.5px] font-extrabold text-canopy">{g.title}</p>
                      <p className="mt-1 text-[13.5px] leading-snug text-muted">{g.body}</p>
                    </div>
                  </div>
                </Card>
              </Rise>
            ))}
          </RiseGroup>
        </div>

        <div className="mt-5 flex gap-2.5 rounded-2xl bg-wash px-4 py-3.5">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
          <p className="text-[13px] leading-snug text-canopy-70">{weather.advice}</p>
        </div>
      </div>
    </div>
  );
}
