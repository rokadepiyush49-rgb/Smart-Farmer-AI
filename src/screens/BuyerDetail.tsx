import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  BadgeCheck, CheckCircle2, MapPin, MessageCircle, Package, Star, Truck,
} from "lucide-react";
import { Card, ScreenHeader, SuccessCheck, Tag } from "@/components/ui";
import { CropGlyph } from "@/components/CropGlyph";
import { Pressable } from "@/motion/Pressable";
import { gentle } from "@/motion/springs";
import { buyers } from "@/data/app";

export default function BuyerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const buyer = buyers.find((b) => b.id === id) ?? buyers[0];

  return (
    <div className="min-h-dvh">
      <ScreenHeader title={buyer.company} subtitle={buyer.kind} />

      <div className="px-5 pb-32">
        {/* offer headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={gentle}
          className="rounded-[28px] bg-gradient-to-br from-leaf to-[#0F5C34] p-5 text-white"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
              <CropGlyph crop={buyer.crop} className="h-8 w-8" />
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <p className="font-display text-[19px] font-extrabold leading-tight">
                  {buyer.company}
                </p>
                {buyer.verified && <BadgeCheck className="h-4.5 w-4.5" />}
              </div>
              <p className="text-[13px] text-white/70">
                {buyer.cropName} · {buyer.distanceKm} km away
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-end gap-2">
            <p className="font-display text-[40px] font-extrabold leading-none">
              ₹{buyer.price.toLocaleString("en-IN")}
            </p>
            <p className="pb-1 text-[14px] font-semibold text-white/70">per quintal</p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { icon: Package, label: "Quantity", value: buyer.quantity },
              { icon: Star, label: "Grade", value: buyer.grade },
              { icon: Truck, label: "Delivery", value: buyer.delivery },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl bg-white/12 px-2 py-3 text-center">
                <m.icon className="mx-auto h-4 w-4 text-white/70" />
                <p className="mt-1 font-display text-[13.5px] font-extrabold">{m.value}</p>
                <p className="text-[10.5px] text-white/60">{m.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* trust row */}
        <Card className="mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Star className="h-4.5 w-4.5 fill-sun text-sun" />
              <span className="font-display text-[16px] font-extrabold text-canopy">
                {buyer.rating}
              </span>
              <span className="text-[12.5px] text-muted">rating</span>
            </div>
            <div className="h-6 w-px bg-hair" />
            <div className="flex items-center gap-1.5 text-[13px] text-muted">
              <MapPin className="h-4 w-4" /> {buyer.distanceKm} km from your farm
            </div>
          </div>
          {buyer.verified && (
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-wash px-3.5 py-2.5">
              <BadgeCheck className="h-4.5 w-4.5 text-leaf" />
              <p className="text-[13px] font-semibold text-leaf-dark">
                Verified buyer — GST and factory licence checked
              </p>
            </div>
          )}
        </Card>

        {/* requirements */}
        <Section title="Quality requirements" items={buyer.quality} />
        <Section title="Delivery conditions" items={buyer.terms} />

        {/* your lot's traceability record — the reason a factory pays a premium */}
        <Card className="mt-4 bg-cream shadow-none ring-1 ring-hair">
          <p className="font-display text-[15.5px] font-extrabold text-canopy">
            Your lot record is ready
          </p>
          <p className="mt-1 text-[13px] leading-snug text-muted">
            Sowing date, treatments applied and every AI scan from this season travel with your
            offer. Verified lots have been fetching 3–5% above the base price.
          </p>
          <Tag tone="wash" className="mt-2.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> 6 scans · 0 disease events
          </Tag>
        </Card>

        <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
          <Pressable size="xl" onClick={() => setAccepted(true)}>
            Accept offer
          </Pressable>
          <Pressable variant="tonal" size="xl" className="w-[68px] px-0" aria-label="Contact buyer">
            <MessageCircle className="h-5 w-5" />
          </Pressable>
        </div>
      </div>

      {/* confirmation sheet */}
      <AnimatePresence>
        {accepted && (
          <motion.div
            className="absolute inset-0 z-50 flex items-end bg-canopy/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAccepted(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-[32px] bg-surface px-6 pb-8 pt-6"
            >
              <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-hair" />
              <div className="flex flex-col items-center">
                <SuccessCheck />
                <h2 className="mt-4 text-center font-display text-[22px] font-extrabold text-canopy">
                  Offer accepted
                </h2>
                <p className="mt-1.5 text-center text-[14px] leading-snug text-muted">
                  {buyer.company} has been notified. Book transport next and we will track the
                  delivery for you.
                </p>
              </div>
              <Pressable size="xl" block className="mt-6" onClick={() => navigate("/transport")}>
                <Truck className="h-5 w-5" /> Book transport
              </Pressable>
              <Pressable
                variant="ghost"
                size="lg"
                block
                className="mt-2 text-muted"
                onClick={() => navigate("/orders/SF-2481")}
              >
                View my order
              </Pressable>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4">
      <h3 className="mb-2.5 px-1 font-display text-[17px] font-extrabold text-canopy">{title}</h3>
      <Card className="py-3">
        {items.map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-start gap-2.5 py-2"
          >
            <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-leaf" />
            <p className="text-[14px] leading-snug text-canopy-70">{t}</p>
          </motion.div>
        ))}
      </Card>
    </div>
  );
}
