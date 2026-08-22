import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight, CalendarDays, IndianRupee, Sparkles, TrendingUp, Wheat,
} from "lucide-react";
import { ConfidenceRing, MeterBar, ScreenHeader, Tag } from "@/components/ui";
import { CropGlyph } from "@/components/CropGlyph";
import { Pressable, PressableCard } from "@/motion/Pressable";
import { ease, gentle, pop } from "@/motion/springs";
import { rankedCrops } from "@/data/app";
import { cn } from "@/lib/cn";

/**
 * One question per screen. Farmers answer by tapping a picture-and-label tile,
 * never by typing into a form.
 */
const questions = [
  {
    key: "soil",
    q: "What is your soil type?",
    hint: "Pick what looks closest to your field.",
    options: [
      { label: "Black soil", sub: "Vertisol", emoji: "🌑" },
      { label: "Red soil", sub: "Lateritic", emoji: "🟤" },
      { label: "Sandy loam", sub: "Light", emoji: "🟡" },
      { label: "Not sure", sub: "We will estimate it", emoji: "🤷" },
    ],
  },
  {
    key: "land",
    q: "How much land will you sow?",
    hint: "You can change this later.",
    options: [
      { label: "Under 2 acres", sub: "Small holding", emoji: "🌱" },
      { label: "2 – 5 acres", sub: "Most common", emoji: "🌿" },
      { label: "5 – 10 acres", sub: "Medium", emoji: "🌳" },
      { label: "Over 10 acres", sub: "Large", emoji: "🏞" },
    ],
  },
  {
    key: "previous",
    q: "What did you grow last season?",
    hint: "This helps plan a healthy rotation.",
    options: [
      { label: "Soybean", sub: "Kharif", emoji: "🫘" },
      { label: "Cotton", sub: "Kharif", emoji: "🤍" },
      { label: "Wheat", sub: "Rabi", emoji: "🌾" },
      { label: "Left fallow", sub: "No crop", emoji: "⬜" },
    ],
  },
  {
    key: "water",
    q: "How much water can you give?",
    hint: "Be honest — it changes the answer a lot.",
    options: [
      { label: "Rain-fed only", sub: "No irrigation", emoji: "🌧" },
      { label: "Limited", sub: "1 – 2 waterings", emoji: "💧" },
      { label: "Assured", sub: "Canal or well", emoji: "🚿" },
      { label: "Drip system", sub: "Efficient", emoji: "💦" },
    ],
  },
];

type Phase = "quiz" | "computing" | "results";

export default function Recommend() {
  const [phase, setPhase] = useState<Phase>("quiz");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const progress = phase === "quiz" ? step / questions.length : 1;

  function answer(value: string) {
    const key = questions[step].key;
    setAnswers((a) => ({ ...a, [key]: value }));
    if (step + 1 < questions.length) {
      setStep((s) => s + 1);
    } else {
      setPhase("computing");
      window.setTimeout(() => setPhase("results"), 2100);
    }
  }

  return (
    <div className="min-h-dvh">
      <ScreenHeader
        title="Crop recommendation"
        subtitle={
          phase === "results"
            ? "Ranked by expected income"
            : `Question ${Math.min(step + 1, questions.length)} of ${questions.length}`
        }
      />

      {/* progress rail */}
      <div className="px-5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-hair">
          <motion.div
            className="h-full rounded-full bg-leaf"
            animate={{ width: `${progress * 100}%` }}
            transition={gentle}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === "quiz" && (
          <motion.div
            key={`q-${step}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={gentle}
            className="px-5 pt-7 pb-32"
          >
            <h2 className="font-display text-[26px] font-extrabold leading-tight text-canopy">
              {questions[step].q}
            </h2>
            <p className="mt-1.5 text-[14px] text-muted">{questions[step].hint}</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {questions[step].options.map((o, i) => {
                const selected = answers[questions[step].key] === o.label;
                return (
                  <motion.div
                    key={o.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, ...gentle }}
                  >
                    <PressableCard
                      onClick={() => answer(o.label)}
                      className={cn(
                        "h-full w-full rounded-[24px] p-4 transition-colors",
                        selected ? "bg-leaf text-white" : "bg-surface shadow-soft",
                      )}
                    >
                      <span className="text-[28px] leading-none">{o.emoji}</span>
                      <p
                        className={cn(
                          "mt-3 font-display text-[16px] font-extrabold leading-tight",
                          selected ? "text-white" : "text-canopy",
                        )}
                      >
                        {o.label}
                      </p>
                      <p className={cn("mt-0.5 text-[12.5px]", selected ? "text-white/70" : "text-muted")}>
                        {o.sub}
                      </p>
                    </PressableCard>
                  </motion.div>
                );
              })}
            </div>

            {step > 0 && (
              <Pressable
                variant="ghost"
                size="md"
                block
                className="mt-5 text-muted"
                onClick={() => setStep((s) => s - 1)}
              >
                Back to previous question
              </Pressable>
            )}

            <div className="mt-6 flex gap-2.5 rounded-2xl bg-wash px-4 py-3.5">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
              <p className="text-[13px] leading-snug text-canopy-70">
                We also read your district's rainfall, soil records and mandi price history —
                you only answer what we cannot look up.
              </p>
            </div>
          </motion.div>
        )}

        {phase === "computing" && <Computing key="computing" />}
        {phase === "results" && <Results key="results" />}
      </AnimatePresence>
    </div>
  );
}

function Computing() {
  const lines = [
    "Reading Wardha rainfall and soil records",
    "Predicting yield for 9 candidate crops",
    "Forecasting mandi prices at harvest month",
    "Subtracting your estimated input costs",
    "Ranking by expected net income",
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid place-items-center px-8 pt-16 pb-32"
    >
      <div className="relative grid h-32 w-32 place-items-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full border-2 border-leaf/35"
            style={{ inset: i * 14 }}
            animate={{ rotate: i % 2 ? -360 : 360 }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "linear" }}
          />
        ))}
        <motion.span
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Wheat className="h-12 w-12 text-leaf" />
        </motion.span>
      </div>

      <h2 className="mt-7 text-center font-display text-[22px] font-extrabold text-canopy">
        Finding your most profitable crop
      </h2>

      <div className="mt-5 w-full">
        {lines.map((l, i) => (
          <motion.p
            key={l}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.32 }}
            className="py-1.5 text-center text-[13.5px] text-muted"
          >
            {l}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}

function Results() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string | null>(rankedCrops[0].id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={gentle}
      className="px-5 pt-6 pb-32"
    >
      <h2 className="font-display text-[24px] font-extrabold leading-tight text-canopy">
        AI recommended crops
      </h2>
      <p className="mt-1.5 text-[14px] leading-snug text-muted">
        Ranked by the money you are likely to keep — not by yield alone.
      </p>

      <div className="mt-5 flex flex-col gap-3.5">
        {rankedCrops.map((c, i) => {
          const expanded = open === c.id;
          return (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, ...gentle }}
              className={cn(
                "overflow-hidden rounded-[26px] bg-surface shadow-soft",
                i === 0 && "ring-2 ring-leaf",
              )}
            >
              <PressableCard
                onClick={() => setOpen(expanded ? null : c.id)}
                className="w-full p-4"
              >
                <div className="flex items-center gap-3.5">
                  <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-wash">
                    <CropGlyph crop={c.id} className="h-8 w-8" />
                    {i === 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ ...pop, delay: 0.4 }}
                        className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-leaf text-[11px] font-extrabold text-white"
                      >
                        1
                      </motion.span>
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[19px] font-extrabold leading-tight text-canopy">
                      {c.name}
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted">{c.suitability}% suitability</p>
                  </div>

                  <ConfidenceRing value={c.suitability} size={62} label="match" />
                </div>

                {/* the profit line is the headline number, deliberately larger than yield */}
                <div className="mt-4 flex items-end gap-4 rounded-2xl bg-cream px-4 py-3">
                  <div>
                    <p className="text-[11.5px] font-bold uppercase tracking-wide text-muted">
                      Expected net income
                    </p>
                    <p className="font-display text-[24px] font-extrabold leading-tight text-leaf-dark">
                      ₹{c.netProfit.toLocaleString("en-IN")}
                      <span className="text-[13px] font-bold text-muted"> /acre</span>
                    </p>
                  </div>
                  <Tag tone={c.risk === "Low" ? "wash" : c.risk === "Medium" ? "sun" : "clay"} className="ml-auto">
                    {c.risk} risk
                  </Tag>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <Stat icon={Wheat} label="Yield" value={c.yield} />
                  <Stat icon={CalendarDays} label="Duration" value={c.duration} />
                  <Stat icon={TrendingUp} label="Market" value={c.outlook} />
                </div>
              </PressableCard>

              {/* explainability: the farmer sees WHY before acting on it */}
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="border-t border-hair px-4 pb-4 pt-4">
                      <p className="mb-3 flex items-center gap-1.5 text-[13px] font-bold text-canopy">
                        <Sparkles className="h-4 w-4 text-leaf" />
                        Why the AI chose this
                      </p>
                      {c.why.map((w, j) => (
                        <div key={w.label} className="mb-3 last:mb-0">
                          <div className="mb-1.5 flex justify-between text-[13px]">
                            <span className="text-canopy-70">{w.label}</span>
                            <span className="font-bold text-muted">{w.weight}</span>
                          </div>
                          <MeterBar
                            value={w.weight}
                            tone={w.weight > 70 ? "bg-leaf" : "bg-sun"}
                            delay={j * 0.08}
                          />
                        </div>
                      ))}

                      <Pressable
                        size="lg"
                        block
                        className="mt-4"
                        onClick={() => navigate("/market")}
                      >
                        <IndianRupee className="h-4.5 w-4.5" /> See buyers for {c.name}
                        <ArrowRight className="h-4 w-4" />
                      </Pressable>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, ...ease }}
        className="mt-5 rounded-2xl bg-cream px-4 py-3.5 text-[12.5px] leading-snug text-muted ring-1 ring-hair"
      >
        Income estimates combine a yield model, a price forecast for your harvest month and
        typical input costs for Wardha. They are guidance, not a guarantee.
      </motion.p>
    </motion.div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Wheat;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-cream px-2.5 py-2.5 text-center">
      <Icon className="mx-auto h-4 w-4 text-muted" />
      <p className="mt-1 font-display text-[13px] font-extrabold leading-tight text-canopy">{value}</p>
      <p className="text-[10.5px] text-muted">{label}</p>
    </div>
  );
}
