import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  BadgeCheck, MapPin, Package, Search, SlidersHorizontal, Star, TrendingUp, Truck,
} from "lucide-react";
import { Card, SectionTitle, Tag } from "@/components/ui";
import { CropGlyph } from "@/components/CropGlyph";
import { PressableCard } from "@/motion/Pressable";
import { gentle, press } from "@/motion/springs";
import { buyers } from "@/data/app";
import { cn } from "@/lib/cn";

const filters = ["All crops", "Wheat", "Soybean", "Onion", "Cotton"] as const;
type Filter = (typeof filters)[number];

export default function Market() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("All crops");

  const list = useMemo(() => {
    return buyers.filter((b) => {
      const matchesFilter = filter === "All crops" || b.cropName === filter;
      const matchesQuery =
        !q.trim() ||
        b.company.toLowerCase().includes(q.toLowerCase()) ||
        b.cropName.toLowerCase().includes(q.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [q, filter]);

  return (
    <div className="px-5 pt-6 pb-32">
      <h1 className="font-display text-[26px] font-extrabold leading-tight text-canopy">
        Sell your crop
      </h1>
      <p className="mt-1 text-[14px] text-muted">
        Verified factories and buyers — no middleman in between.
      </p>

      {/* search */}
      <div className="mt-4 flex items-center gap-2 rounded-[22px] bg-surface px-4 py-3.5 shadow-soft">
        <Search className="h-5 w-5 shrink-0 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search crop or buyer"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-canopy outline-none placeholder:text-muted"
        />
        <button className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-wash" aria-label="Filters">
          <SlidersHorizontal className="h-4 w-4 text-leaf-dark" />
        </button>
      </div>

      {/* filter chips — the active pill slides between options */}
      <div className="no-scrollbar -mx-5 mt-3.5 flex gap-2 overflow-x-auto px-5 pb-1">
        {filters.map((f) => {
          const active = f === filter;
          return (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              whileTap={{ scale: 0.94 }}
              transition={press}
              className={cn(
                "relative shrink-0 rounded-full px-4 py-2.5 text-[13.5px] font-bold",
                active ? "text-white" : "bg-surface text-canopy shadow-soft",
              )}
            >
              {active && (
                <motion.span
                  layoutId="market-filter"
                  transition={gentle}
                  className="absolute inset-0 rounded-full bg-leaf"
                />
              )}
              <span className="relative z-10">{f}</span>
            </motion.button>
          );
        })}
      </div>

      {/* price ticker */}
      <Card className="mt-4 bg-gradient-to-r from-sun-wash to-cream">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sun/20">
            <TrendingUp className="h-5 w-5 text-[#9a6608]" />
          </span>
          <div className="flex-1">
            <p className="text-[12px] font-bold uppercase tracking-wide text-[#9a6608]">
              Price forecast
            </p>
            <p className="font-display text-[15.5px] font-extrabold leading-tight text-canopy">
              Wheat ₹2,470–2,520 in 3 weeks
            </p>
          </div>
          <Tag tone="sun">Hold</Tag>
        </div>
      </Card>

      {/* buyers */}
      <div className="mt-6">
        <SectionTitle title={`${list.length} buyers near you`} />
        <motion.div layout className="flex flex-col gap-3.5">
          <AnimatePresence mode="popLayout">
            {list.map((b) => (
              <motion.div
                key={b.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={gentle}
              >
                <PressableCard
                  onClick={() => navigate(`/market/${b.id}`)}
                  className="w-full rounded-[26px] bg-surface p-4 shadow-soft"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-wash">
                      <CropGlyph crop={b.crop} className="h-7 w-7" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate font-display text-[17px] font-extrabold leading-tight text-canopy">
                          {b.company}
                        </p>
                        {b.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-leaf" />}
                      </div>
                      <p className="mt-0.5 text-[12.5px] text-muted">
                        {b.kind} · {b.cropName}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-display text-[19px] font-extrabold leading-none text-leaf-dark">
                        ₹{b.price.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[11px] text-muted">per quintal</p>
                    </div>
                  </div>

                  <div className="mt-3.5 grid grid-cols-3 gap-2">
                    <Mini icon={Package} label="Needs" value={b.quantity} />
                    <Mini icon={Star} label="Grade" value={b.grade} />
                    <Mini icon={Truck} label="Delivery" value={b.delivery} />
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-[12.5px] text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {b.distanceKm} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-sun text-sun" /> {b.rating}
                    </span>
                    <span className="ml-auto font-bold text-leaf">View offer →</span>
                  </div>
                </PressableCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {list.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[24px] bg-surface px-4 py-8 text-center text-[14px] text-muted shadow-soft"
          >
            No buyers match that search yet.
          </motion.p>
        )}
      </div>
    </div>
  );
}

function Mini({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Package;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-cream px-2 py-2 text-center">
      <Icon className="mx-auto h-3.5 w-3.5 text-muted" />
      <p className="mt-1 text-[12.5px] font-extrabold leading-tight text-canopy">{value}</p>
      <p className="text-[10px] text-muted">{label}</p>
    </div>
  );
}
