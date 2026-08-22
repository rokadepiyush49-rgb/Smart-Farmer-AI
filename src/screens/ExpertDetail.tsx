import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import {
  BadgeCheck, CalendarDays, Languages, MessageCircle, Phone, Star, Video,
} from "lucide-react";
import { Card, ScreenHeader, Tag } from "@/components/ui";
import { Pressable, PressableCard } from "@/motion/Pressable";
import { gentle } from "@/motion/springs";
import { experts } from "@/data/app";

const options = [
  { icon: MessageCircle, label: "Chat", note: "Reply within 30 min", tint: "bg-wash text-leaf-dark" },
  { icon: Phone, label: "Voice call", note: "15 minute call", tint: "bg-sky-wash text-sky" },
  { icon: Video, label: "Video call", note: "Show your field live", tint: "bg-sun-wash text-[#9a6608]" },
  { icon: CalendarDays, label: "Appointment", note: "Pick a time that suits you", tint: "bg-soil-wash text-soil" },
];

export default function ExpertDetail() {
  const { id } = useParams();
  const e = experts.find((x) => x.id === id) ?? experts[0];

  return (
    <div className="min-h-dvh">
      <ScreenHeader title={e.name} subtitle={e.qual} />

      <div className="px-5 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={gentle}
          className="flex flex-col items-center rounded-[28px] bg-surface p-6 shadow-soft"
        >
          <div className="relative">
            <span
              className="grid h-24 w-24 place-items-center rounded-[28px] font-display text-[34px] font-extrabold text-white"
              style={{ background: e.hue }}
            >
              {e.name.split(" ").slice(-1)[0][0]}
            </span>
            {e.online && (
              <motion.span
                className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-sprout ring-4 ring-white"
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>

          <div className="mt-4 flex items-center gap-1.5">
            <h2 className="font-display text-[21px] font-extrabold text-canopy">{e.name}</h2>
            <BadgeCheck className="h-5 w-5 text-leaf" />
          </div>
          <p className="mt-0.5 text-[13.5px] text-muted">{e.qual}</p>
          <p className="mt-2 text-center text-[14px] font-semibold text-leaf-dark">{e.spec}</p>

          <div className="mt-4 grid w-full grid-cols-3 gap-2">
            {[
              { value: e.rating.toFixed(1), label: "Rating" },
              { value: `${e.years} yrs`, label: "Experience" },
              { value: `${e.reviews}`, label: "Consults" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-cream px-2 py-3 text-center">
                <p className="font-display text-[17px] font-extrabold text-canopy">{s.value}</p>
                <p className="text-[10.5px] text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Tag tone="wash">
              <Languages className="h-3.5 w-3.5" /> {e.languages.join(" · ")}
            </Tag>
            <Tag tone={e.online ? "wash" : "soil"}>
              {e.online ? "Available now" : "Offline"}
            </Tag>
            <Tag tone={e.fee === 0 ? "wash" : "sun"}>
              {e.fee === 0 ? "Free consultation" : `₹${e.fee} per consult`}
            </Tag>
          </div>
        </motion.div>

        <h3 className="mb-3 mt-6 px-1 font-display text-[18px] font-extrabold text-canopy">
          How would you like to talk?
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {options.map((o, i) => (
            <motion.div
              key={o.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, ...gentle }}
            >
              <PressableCard className="h-full w-full rounded-[24px] bg-surface p-4 shadow-soft">
                <span className={`mb-3 grid h-12 w-12 place-items-center rounded-2xl ${o.tint}`}>
                  <o.icon className="h-6 w-6" />
                </span>
                <p className="font-display text-[15.5px] font-extrabold text-canopy">{o.label}</p>
                <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{o.note}</p>
              </PressableCard>
            </motion.div>
          ))}
        </div>

        <Card className="mt-5 bg-cream shadow-none ring-1 ring-hair">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-sun text-sun" />
            <p className="text-[13.5px] font-bold text-canopy">Recent farmer review</p>
          </div>
          <p className="mt-2 text-[13.5px] leading-snug text-canopy-70">
            "Told me exactly which spray to use and how much. My wheat recovered in two weeks."
          </p>
          <p className="mt-1.5 text-[12px] text-muted">— Sunil, Hinganghat</p>
        </Card>

        <Pressable size="xl" block className="mt-6">
          Consult {e.name.split(" ")[0]}
        </Pressable>
      </div>
    </div>
  );
}
