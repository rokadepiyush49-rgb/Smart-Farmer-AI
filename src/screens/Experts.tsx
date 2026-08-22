import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Languages, MessageCircle, Phone, Star, Video } from "lucide-react";
import { Card, ScreenHeader, Tag } from "@/components/ui";
import { PressableCard } from "@/motion/Pressable";
import { gentle } from "@/motion/springs";
import { experts } from "@/data/app";
import { cn } from "@/lib/cn";

export default function Experts() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh">
      <ScreenHeader title="Agricultural experts" subtitle="Real people, not just AI" />

      <div className="px-5 pb-32">
        <Card className="bg-gradient-to-r from-wash to-cream shadow-none">
          <p className="font-display text-[16px] font-extrabold text-canopy">
            When the AI is not sure, a human is
          </p>
          <p className="mt-1 text-[13px] leading-snug text-muted">
            Low-confidence scans are sent to an expert automatically. You can also reach one
            yourself, any time.
          </p>
        </Card>

        <div className="mt-5 flex flex-col gap-3.5">
          {experts.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, ...gentle }}
            >
              <PressableCard
                onClick={() => navigate(`/experts/${e.id}`)}
                className="w-full rounded-[26px] bg-surface p-4 shadow-soft"
              >
                <div className="flex gap-3.5">
                  <div className="relative shrink-0">
                    <span
                      className="grid h-16 w-16 place-items-center rounded-[20px] font-display text-[22px] font-extrabold text-white"
                      style={{ background: e.hue }}
                    >
                      {e.name.split(" ").slice(-1)[0][0]}
                    </span>
                    {e.online && (
                      <motion.span
                        className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-sprout ring-[3px] ring-white"
                        animate={{ scale: [1, 1.18, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-[17px] font-extrabold leading-tight text-canopy">
                      {e.name}
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-muted">{e.qual}</p>
                    <p className="mt-1 text-[13px] font-semibold text-leaf-dark">{e.spec}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Tag tone="wash">
                        <Star className="h-3.5 w-3.5 fill-sun text-sun" /> {e.rating} · {e.reviews}
                      </Tag>
                      <Tag tone="soil">{e.years} yrs</Tag>
                      <Tag tone={e.fee === 0 ? "wash" : "sun"}>
                        {e.fee === 0 ? "Free" : `₹${e.fee}`}
                      </Tag>
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 text-[12px] text-muted">
                      <Languages className="h-3.5 w-3.5" />
                      {e.languages.join(" · ")}
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 grid grid-cols-3 gap-2">
                  {[
                    { icon: MessageCircle, label: "Chat" },
                    { icon: Phone, label: "Voice" },
                    { icon: Video, label: "Video" },
                  ].map((c) => (
                    <span
                      key={c.label}
                      className={cn(
                        "flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12.5px] font-bold",
                        e.online ? "bg-wash text-leaf-dark" : "bg-cream text-muted",
                      )}
                    >
                      <c.icon className="h-3.5 w-3.5" /> {c.label}
                    </span>
                  ))}
                </div>

                {!e.online && (
                  <p className="mt-2.5 text-center text-[12px] text-muted">
                    Offline — next available tomorrow 10 AM
                  </p>
                )}
              </PressableCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
