import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Camera, CheckCircle2, Image as ImageIcon, Info, Leaf, RotateCcw,
  ShieldCheck, Sparkles, Stethoscope, Sun,
} from "lucide-react";
import { Card, ConfidenceRing, MeterBar, ScreenHeader, Segmented, Tag } from "@/components/ui";
import { LeafArt } from "@/components/CropGlyph";
import { Pressable } from "@/motion/Pressable";
import { ease, gentle, pop } from "@/motion/springs";
import { diseaseResult } from "@/data/app";
import { cn } from "@/lib/cn";

type Phase = "capture" | "analyzing" | "result";

const analysisSteps = [
  "Finding the leaf in your photo",
  "Comparing against 38 disease patterns",
  "Measuring how much leaf is affected",
  "Writing your treatment plan",
];

export default function Scan() {
  const [phase, setPhase] = useState<Phase>("capture");

  return (
    <div className="min-h-dvh">
      <ScreenHeader
        title="Check your crop"
        subtitle={phase === "result" ? "AI diagnosis complete" : "Computer vision diagnosis"}
      />
      <AnimatePresence mode="wait">
        {phase === "capture" && <CaptureStep key="capture" onStart={() => setPhase("analyzing")} />}
        {phase === "analyzing" && <AnalyzingStep key="analyzing" onDone={() => setPhase("result")} />}
        {phase === "result" && <ResultStep key="result" onRetake={() => setPhase("capture")} />}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------- step 1 */

function CaptureStep({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={gentle}
      className="px-5 pb-32"
    >
      <div className="relative mt-2 grid place-items-center overflow-hidden rounded-[28px] bg-gradient-to-b from-wash to-cream py-8">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <LeafArt className="h-44 w-44" />
        </motion.div>
        {/* focus reticle, so the framing instruction is visual not textual */}
        <motion.span
          className="pointer-events-none absolute h-[190px] w-[190px] rounded-[36px] border-[3px] border-dashed border-leaf/40"
          animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <h2 className="mt-6 text-center font-display text-[24px] font-extrabold text-canopy">
        Take a clear photo of the affected leaf
      </h2>
      <p className="mx-auto mt-2 max-w-[300px] text-center text-[14px] leading-snug text-muted">
        Hold the leaf flat, fill the frame, and use daylight if you can.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2.5">
        {[
          { icon: Sun, label: "Good light" },
          { icon: Leaf, label: "One leaf" },
          { icon: Camera, label: "Close up" },
        ].map(({ icon: Icon, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="flex flex-col items-center gap-1.5 rounded-2xl bg-surface py-3.5 shadow-soft"
          >
            <Icon className="h-5 w-5 text-leaf" />
            <span className="text-[12px] font-bold text-canopy">{label}</span>
          </motion.div>
        ))}
      </div>

      <Pressable size="xl" block className="mt-6" onClick={onStart}>
        <Camera className="h-5 w-5" /> Take photo
      </Pressable>
      <Pressable variant="tonal" size="lg" block className="mt-3" onClick={onStart}>
        <ImageIcon className="h-5 w-5" /> Upload from gallery
      </Pressable>

      <div className="mt-5 flex gap-2.5 rounded-2xl bg-sky-wash px-4 py-3.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
        <p className="text-[13px] leading-snug text-[#1d6cb0]">
          This works without internet. Your photo is analysed on your phone, and syncs
          when you are back online.
        </p>
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- step 2 */

function AnalyzingStep({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = analysisSteps.map((_, i) =>
      window.setTimeout(() => setStep(i + 1), 620 * (i + 1)),
    );
    const finish = window.setTimeout(onDone, 620 * analysisSteps.length + 700);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finish);
    };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="px-5 pb-32"
    >
      {/* the scan surface: sweeping line + travelling grid + pulsing corners */}
      <div className="relative mt-2 aspect-square overflow-hidden rounded-[28px] bg-canopy">
        <div className="absolute inset-0 grid place-items-center opacity-90">
          <LeafArt className="h-56 w-56" />
        </div>

        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(#34C77B 1px, transparent 1px), linear-gradient(90deg, #34C77B 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {!reduce && (
          <>
            <motion.div
              className="absolute inset-x-0 h-[4px] bg-sprout shadow-[0_0_28px_8px_rgba(52,199,123,0.85)]"
              animate={{ top: ["4%", "94%", "4%"] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
            />
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className={cn(
                  "absolute h-8 w-8 border-sprout",
                  i === 0 && "left-4 top-4 rounded-tl-xl border-l-[3px] border-t-[3px]",
                  i === 1 && "right-4 top-4 rounded-tr-xl border-r-[3px] border-t-[3px]",
                  i === 2 && "bottom-4 left-4 rounded-bl-xl border-b-[3px] border-l-[3px]",
                  i === 3 && "bottom-4 right-4 rounded-br-xl border-b-[3px] border-r-[3px]",
                )}
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.12 }}
              />
            ))}
          </>
        )}
      </div>

      <h2 className="mt-6 text-center font-display text-[22px] font-extrabold text-canopy">
        Analysing your crop…
      </h2>

      <div className="mt-5 flex flex-col gap-2.5">
        {analysisSteps.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <motion.div
              key={label}
              animate={{ opacity: done || active ? 1 : 0.4 }}
              className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3.5 shadow-soft"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center">
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.span key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={pop}>
                      <CheckCircle2 className="h-6 w-6 text-leaf" />
                    </motion.span>
                  ) : active ? (
                    <motion.span
                      key="spin"
                      className="h-5 w-5 rounded-full border-[3px] border-wash border-t-leaf"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <motion.span key="idle" className="h-2.5 w-2.5 rounded-full bg-hair" />
                  )}
                </AnimatePresence>
              </span>
              <span className="text-[14px] font-semibold text-canopy">{label}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- step 3 */

type Tab = "treatment" | "organic" | "prevention";

function ResultStep({ onRetake }: { onRetake: () => void }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("treatment");
  const d = diseaseResult;

  const panel =
    tab === "treatment" ? d.chemical
    : tab === "organic" ? d.organic
    : { title: "Prevent it next season", lines: d.prevention };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={gentle}
      className="px-5 pb-32"
    >
      {/* headline diagnosis */}
      <Card className="mt-2 bg-gradient-to-br from-clay-wash to-cream">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <Tag tone="clay">Disease detected</Tag>
            <h2 className="mt-2 font-display text-[26px] font-extrabold leading-tight text-canopy">
              {d.name}
            </h2>
            <p className="mt-0.5 text-[13px] italic text-muted">{d.scientific}</p>
          </div>
          <ConfidenceRing value={d.confidence} size={84} tone="#E5484D" label="confidence" />
        </div>

        <p className="mt-4 text-[14px] leading-snug text-canopy-70">{d.summary}</p>

        {/* severity is what actually decides dosage, so it gets its own meter */}
        <div className="mt-4 rounded-2xl bg-white/70 p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-bold text-canopy">Severity · {d.severityLabel}</span>
            <span className="text-[13px] font-extrabold text-clay">{d.severity}%</span>
          </div>
          <MeterBar value={d.severity} tone="bg-clay" delay={0.25} />
          <p className="mt-2 text-[12.5px] text-muted">{d.affected}</p>
        </div>
      </Card>

      {/* symptoms */}
      <section className="mt-5">
        <h3 className="mb-2.5 px-1 font-display text-[18px] font-extrabold text-canopy">
          What to look for
        </h3>
        <Card className="py-4">
          {d.symptoms.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08, ...ease }}
              className="flex items-start gap-2.5 py-2"
            >
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-clay" />
              <p className="text-[14px] leading-snug text-canopy-70">{s}</p>
            </motion.div>
          ))}
        </Card>
      </section>

      {/* treatment tabs */}
      <section className="mt-5">
        <h3 className="mb-2.5 px-1 font-display text-[18px] font-extrabold text-canopy">
          What to do
        </h3>
        <Segmented
          id="treatment"
          value={tab}
          onChange={setTab}
          options={[
            { value: "treatment", label: "Treatment" },
            { value: "organic", label: "Organic" },
            { value: "prevention", label: "Prevention" },
          ]}
        />
        <Card className="mt-3">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-leaf" />
            <p className="font-display text-[16px] font-extrabold text-canopy">{panel.title}</p>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {panel.lines.map((line, i) => (
                <div key={line} className="flex items-start gap-3 py-2">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-wash text-[12px] font-extrabold text-leaf-dark">
                    {i + 1}
                  </span>
                  <p className="text-[14px] leading-snug text-canopy-70">{line}</p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </Card>
      </section>

      {/* honest about what else it could be — trust beats false certainty */}
      <section className="mt-5">
        <Card className="bg-cream shadow-none ring-1 ring-hair">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted" />
            <p className="text-[13px] font-bold text-muted">AI also considered</p>
          </div>
          {d.alternatives.map((a) => (
            <div key={a.name} className="flex items-center justify-between py-1.5">
              <span className="text-[13.5px] text-canopy-70">{a.name}</span>
              <span className="text-[13px] font-bold text-muted">{a.p}%</span>
            </div>
          ))}
        </Card>
      </section>

      <Pressable size="xl" block className="mt-6" onClick={() => navigate("/experts")}>
        <Stethoscope className="h-5 w-5" /> Talk to an agricultural expert
      </Pressable>
      <Pressable variant="tonal" size="lg" block className="mt-3" onClick={onRetake}>
        <RotateCcw className="h-5 w-5" /> Scan another leaf
      </Pressable>

      {/* closed feedback loop — this is what lets the model learn from real fields */}
      <Card className="mt-5 bg-wash shadow-none">
        <p className="font-display text-[15.5px] font-extrabold text-canopy">
          We will check back in 10 days
        </p>
        <p className="mt-1 text-[13px] leading-snug text-canopy-70">
          Tell us whether the treatment worked, and Smart Farmer AI gets better for every
          farmer in Wardha.
        </p>
      </Card>
    </motion.div>
  );
}
