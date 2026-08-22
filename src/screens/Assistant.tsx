import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Camera, Languages, Mic, Send, Sparkles, Volume2 } from "lucide-react";
import { Pressable, PressableCard } from "@/motion/Pressable";
import { gentle, press } from "@/motion/springs";
import { suggestedQuestions } from "@/data/app";
import { cn } from "@/lib/cn";

type Msg = { id: number; from: "ai" | "user"; text: string; cites?: string };

const opening: Msg[] = [
  {
    id: 0,
    from: "ai",
    text: "Namaskar Piyush 🌱 I can help with your crops, the weather, prices and treatments. Ask me anything — you can also just speak.",
  },
];

/** Canned answers so the prototype demonstrates a grounded, cited assistant. */
const replies: Record<string, { text: string; cites: string }> = {
  default: {
    text: "For your wheat at the tillering stage in Wardha, apply the second nitrogen split this week and hold off on spraying until Tuesday's rain passes.",
    cites: "ICAR wheat package of practices, 2024",
  },
  irrigate: {
    text: "Your estimated soil water balance is at 42% of field capacity. Irrigate about 22 mm on Thursday — after Tuesday's rain, not before it.",
    cites: "FAO-56 water balance · IMD Wardha forecast",
  },
  price: {
    text: "Wheat is trading at ₹2,450 per quintal in Wardha today, about 6% above last month. My 3-week forecast is ₹2,470–2,520, so holding a little longer looks slightly better than selling now.",
    cites: "Agmarknet daily mandi prices",
  },
  rain: {
    text: "Rain is likely on Tuesday and Wednesday — 78% and 65% chance. Friday onwards is clear and good for field work.",
    cites: "IMD / Open-Meteo 7-day forecast",
  },
};

function pickReply(q: string) {
  const s = q.toLowerCase();
  if (s.includes("irrigat") || s.includes("water") || s.includes("पाणी")) return replies.irrigate;
  if (s.includes("price") || s.includes("market") || s.includes("भाव")) return replies.price;
  if (s.includes("rain") || s.includes("weather") || s.includes("पाऊस")) return replies.rain;
  return replies.default;
}

export default function Assistant() {
  const [msgs, setMsgs] = useState<Msg[]>(opening);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const seed = useRef(1);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, typing]);

  function ask(text: string) {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { id: seed.current++, from: "user", text }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      const r = pickReply(text);
      setTyping(false);
      setMsgs((m) => [...m, { id: seed.current++, from: "ai", text: r.text, cites: r.cites }]);
    }, 1250);
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* header */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-canopy to-[#175943] px-5 pb-5 pt-6 text-white">
        <div className="flex items-center gap-3">
          <motion.span
            className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-6 w-6" />
          </motion.span>
          <div className="flex-1">
            <h1 className="font-display text-[21px] font-extrabold leading-tight">
              Ask Smart Farmer AI 🌱
            </h1>
            <p className="text-[13px] text-white/70">Your AI farming companion</p>
          </div>
          <Pressable
            variant="ghost"
            size="sm"
            ripple={false}
            className="h-11 w-11 bg-white/12 px-0 text-white hover:bg-white/20"
            aria-label="Change language"
          >
            <Languages className="h-5 w-5" />
          </Pressable>
        </div>
      </div>

      {/* thread */}
      <div className="flex-1 px-5 pt-5">
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {msgs.map((m) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={gentle}
                className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[86%] rounded-[22px] px-4 py-3 text-[14.5px] leading-snug shadow-soft",
                    m.from === "user"
                      ? "rounded-br-md bg-leaf text-white"
                      : "rounded-bl-md bg-surface text-canopy",
                  )}
                >
                  {m.text}
                  {m.cites && (
                    <div className="mt-2.5 flex items-center gap-2 border-t border-hair pt-2.5">
                      <span className="text-[11.5px] font-semibold text-muted">
                        Source: {m.cites}
                      </span>
                      <button className="ml-auto grid h-7 w-7 place-items-center rounded-full bg-wash">
                        <Volume2 className="h-3.5 w-3.5 text-leaf" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && <TypingBubble />}
        </div>

        {/* suggestions */}
        {msgs.length <= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <p className="mb-2.5 px-1 text-[13px] font-bold text-muted">Try asking</p>
            <div className="flex flex-col gap-2.5">
              {suggestedQuestions.map((q, i) => (
                <motion.div
                  key={q.text}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.06 }}
                >
                  <PressableCard
                    onClick={() => ask(q.text)}
                    className="flex w-full items-center gap-3 rounded-[20px] bg-surface px-4 py-3.5 shadow-soft"
                  >
                    <span className="text-xl">{q.icon}</span>
                    <span className="flex-1 text-[14px] font-semibold text-canopy">{q.text}</span>
                  </PressableCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div ref={endRef} className="h-4" />
      </div>

      {/* composer */}
      <div className="sticky bottom-0 z-30 bg-cream/92 px-4 pb-24 pt-3 backdrop-blur-xl">
        <AnimatePresence>
          {listening && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="mb-3 flex items-center gap-3 rounded-[22px] bg-canopy px-4 py-3.5 text-white"
            >
              <VoiceWave />
              <div className="flex-1">
                <p className="text-[14px] font-bold">Listening…</p>
                <p className="text-[12px] text-white/60">Speak in मराठी, हिंदी or English</p>
              </div>
              <Pressable
                size="sm"
                variant="ghost"
                className="bg-white/15 text-white"
                onClick={() => {
                  setListening(false);
                  ask("When should I irrigate my wheat?");
                }}
              >
                Done
              </Pressable>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2 rounded-[26px] bg-surface p-2 shadow-soft">
          <Pressable variant="ghost" size="sm" ripple={false} className="h-11 w-11 px-0" aria-label="Add a photo">
            <Camera className="h-5 w-5 text-muted" />
          </Pressable>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask(input)}
            placeholder="Ask about your farm…"
            className="min-w-0 flex-1 bg-transparent py-3 text-[15px] text-canopy outline-none placeholder:text-muted"
          />
          {input.trim() ? (
            <Pressable size="sm" className="h-11 w-11 px-0" onClick={() => ask(input)} aria-label="Send">
              <Send className="h-4.5 w-4.5" />
            </Pressable>
          ) : (
            <MicButton listening={listening} onToggle={() => setListening((v) => !v)} />
          )}
        </div>
      </div>
    </div>
  );
}

function MicButton({ listening, onToggle }: { listening: boolean; onToggle: () => void }) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      onClick={onToggle}
      whileTap={reduce ? undefined : { scale: 0.9 }}
      transition={press}
      aria-label="Speak your question"
      className={cn(
        "relative grid h-11 w-11 shrink-0 place-items-center rounded-full",
        listening ? "bg-clay text-white" : "bg-leaf text-white",
      )}
    >
      {/* concentric rings radiate while the mic is live */}
      {listening &&
        !reduce &&
        [0, 1].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border-2 border-clay"
            animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
          />
        ))}
      <Mic className="h-5 w-5" />
    </motion.button>
  );
}

function VoiceWave() {
  return (
    <div className="flex h-8 items-center gap-[3px]">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-sprout"
          animate={{ height: [6, 22, 10, 26, 6] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.09, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="flex gap-1.5 rounded-[22px] rounded-bl-md bg-surface px-4 py-4 shadow-soft">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-leaf"
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
