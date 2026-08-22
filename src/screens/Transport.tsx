import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Clock, IndianRupee, MapPin, Navigation, Star, Truck } from "lucide-react";
import { Card, ScreenHeader, SuccessCheck } from "@/components/ui";
import { Pressable, PressableCard } from "@/motion/Pressable";
import { gentle, press } from "@/motion/springs";
import { cn } from "@/lib/cn";

/** One source of truth for the route: the drawn path and the moving vehicle share it. */
const ROUTE = "M40 138 C 110 130, 120 60, 190 54 S 280 44, 300 38";

const services = [
  { id: "s1", name: "Vidarbha Logistics", vehicle: "Tractor trolley · 5 ton", eta: "45 min", price: 1800, rating: 4.7 },
  { id: "s2", name: "Kisan Transport", vehicle: "Mini truck · 8 ton", eta: "1 hr 10 min", price: 2600, rating: 4.5 },
  { id: "s3", name: "Sharma Carriers", vehicle: "Truck · 16 ton", eta: "2 hr", price: 4200, rating: 4.8 },
];

export default function Transport() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [picked, setPicked] = useState(services[0].id);
  const [booked, setBooked] = useState(false);

  return (
    <div className="min-h-dvh">
      <ScreenHeader title="Book transport" subtitle="Farm gate to factory" />

      <div className="px-5 pb-32">
        {/* route map — an abstract, illustrative route rather than a live map */}
        <Card className="overflow-hidden p-0">
          <div className="relative h-44 bg-wash">
            {/* The route and the vehicle live in the same SVG user space, so the
                marker stays glued to the path at every screen width. */}
            <svg viewBox="0 0 340 176" className="h-full w-full">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <path key={i} d={`M0 ${20 + i * 30} H340`} stroke="#CFEEDA" strokeWidth="1.5" />
              ))}

              <path
                id="route"
                d={ROUTE}
                stroke="#1B7A45"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="10 8"
              />
              <circle cx="40" cy="138" r="9" fill="#1B7A45" />
              <circle cx="300" cy="38" r="9" fill="#F5A524" />

              <g>
                <circle r="13" fill="#0F3D2E" />
                <path
                  d="M-6 2h5v-4h3l3 3v1h1"
                  stroke="#fff"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="-3.5" cy="3.5" r="1.6" fill="#34C77B" />
                <circle cx="4" cy="3.5" r="1.6" fill="#34C77B" />
                {!reduce && (
                  <animateMotion dur="5s" repeatCount="indefinite" rotate="auto" path={ROUTE} />
                )}
              </g>
            </svg>
          </div>

          <div className="p-4">
            <Point icon={MapPin} tone="bg-wash text-leaf" label="Pickup" value="Your farm · Wardha" />
            <div className="my-1 ml-5 h-5 w-[2px] rounded-full bg-hair" />
            <Point icon={Navigation} tone="bg-sun-wash text-[#9a6608]" label="Drop" value="Anandvan Foods · 18 km" />
          </div>
        </Card>

        {/* services */}
        <h2 className="mb-3 mt-6 px-1 font-display text-[19px] font-extrabold text-canopy">
          Choose a service
        </h2>
        <div className="flex flex-col gap-3">
          {services.map((s, i) => {
            const active = s.id === picked;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, ...gentle }}
              >
                <PressableCard
                  onClick={() => setPicked(s.id)}
                  className={cn(
                    "w-full rounded-[24px] p-4 transition-colors",
                    active ? "bg-surface ring-2 ring-leaf" : "bg-surface",
                    "shadow-soft",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <motion.span
                      animate={active ? { scale: 1.06 } : { scale: 1 }}
                      transition={press}
                      className={cn(
                        "grid h-12 w-12 shrink-0 place-items-center rounded-2xl",
                        active ? "bg-leaf text-white" : "bg-wash text-leaf-dark",
                      )}
                    >
                      <Truck className="h-6 w-6" />
                    </motion.span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[16px] font-extrabold leading-tight text-canopy">
                        {s.name}
                      </p>
                      <p className="text-[12.5px] text-muted">{s.vehicle}</p>
                      <div className="mt-1 flex items-center gap-3 text-[12px] text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {s.eta}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-sun text-sun" /> {s.rating}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-display text-[18px] font-extrabold text-canopy">
                        ₹{s.price.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[11px] text-muted">total</p>
                    </div>
                  </div>
                </PressableCard>
              </motion.div>
            );
          })}
        </div>

        <Pressable size="xl" block className="mt-6" onClick={() => setBooked(true)}>
          <IndianRupee className="h-5 w-5" /> Confirm booking
        </Pressable>
      </div>

      <AnimatePresence>
        {booked && (
          <motion.div
            className="absolute inset-0 z-50 grid place-items-center bg-canopy/45 px-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="w-full rounded-[30px] bg-surface p-6 text-center"
            >
              <div className="flex justify-center">
                <SuccessCheck />
              </div>
              <h2 className="mt-4 font-display text-[22px] font-extrabold text-canopy">
                Transport booked
              </h2>
              <p className="mt-1.5 text-[14px] leading-snug text-muted">
                Pickup on 6 September at 9:00 AM from your farm gate.
              </p>
              <Pressable size="lg" block className="mt-5" onClick={() => navigate("/orders/SF-2481")}>
                Track my order
              </Pressable>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Point({
  icon: Icon,
  tone,
  label,
  value,
}: {
  icon: typeof MapPin;
  tone: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-2xl", tone)}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-[11.5px] font-bold uppercase tracking-wide text-muted">{label}</p>
        <p className="font-display text-[15px] font-extrabold leading-tight text-canopy">{value}</p>
      </div>
    </div>
  );
}
