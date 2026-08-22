import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ChevronRight, CircleHelp, Languages, LayoutDashboard, LogOut, MapPin,
  Mic, Package, Settings, Sprout, Stethoscope, Wallet,
} from "lucide-react";
import { Card, SectionTitle, Tag } from "@/components/ui";
import { PressableCard } from "@/motion/Pressable";
import { gentle, press } from "@/motion/springs";
import { farmer } from "@/data/app";
import { cn } from "@/lib/cn";

const languages = ["मराठी", "हिंदी", "English"];

const rows = [
  { icon: Sprout, label: "My farm", note: `${farmer.landAcres} acres · ${farmer.soil}`, to: "/farm" },
  { icon: Package, label: "My orders", note: "1 active · 3 completed", to: "/orders/SF-2481" },
  { icon: Wallet, label: "Payments", note: "₹48,500 earned this season", to: "/earnings" },
  { icon: Stethoscope, label: "Consultation history", note: "4 consultations", to: "/experts" },
];

const settingsRows = [
  { icon: Settings, label: "Settings" },
  { icon: CircleHelp, label: "Help & support" },
];

export default function Profile() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("मराठी");
  const [voice, setVoice] = useState(true);
  const [readAloud, setReadAloud] = useState(true);

  return (
    <div className="px-5 pt-6 pb-32">
      {/* identity */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={gentle}
        className="flex items-center gap-4 rounded-[28px] bg-gradient-to-br from-canopy to-[#17604A] p-5 text-white"
      >
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[22px] bg-white/15 font-display text-[26px] font-extrabold">
          {farmer.name[0]}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[21px] font-extrabold leading-tight">{farmer.name}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-white/70">
            <MapPin className="h-3.5 w-3.5" /> {farmer.village}, Maharashtra
          </p>
          <Tag tone="canopy" className="mt-2 bg-white/15 text-white">
            Verified farmer
          </Tag>
        </div>
      </motion.div>

      {/* language — the single most impactful setting, so it sits at the top */}
      <div className="mt-6">
        <SectionTitle title="Language" />
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Languages className="h-5 w-5 text-leaf" />
            <p className="text-[14px] font-bold text-canopy">App language</p>
          </div>
          <div className="flex gap-2">
            {languages.map((l) => {
              const active = l === lang;
              return (
                <motion.button
                  key={l}
                  onClick={() => setLang(l)}
                  whileTap={{ scale: 0.95 }}
                  transition={press}
                  className={cn(
                    "relative flex-1 rounded-2xl py-3 text-[14px] font-bold",
                    active ? "text-white" : "bg-cream text-canopy",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="lang-pill"
                      transition={gentle}
                      className="absolute inset-0 rounded-2xl bg-leaf"
                    />
                  )}
                  <span className="relative z-10">{l}</span>
                </motion.button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* voice */}
      <div className="mt-6">
        <SectionTitle title="Voice assistant" />
        <Card className="py-2">
          <ToggleRow
            icon={Mic}
            label="Voice input"
            note="Ask questions by speaking"
            value={voice}
            onChange={setVoice}
          />
          <ToggleRow
            icon={Languages}
            label="Read answers aloud"
            note="AI speaks its reply in your language"
            value={readAloud}
            onChange={setReadAloud}
          />
        </Card>
      </div>

      {/* account rows */}
      <div className="mt-6">
        <SectionTitle title="Your account" />
        <Card className="py-2">
          {rows.map((r) => (
            <Row key={r.label} {...r} onClick={() => navigate(r.to)} />
          ))}
        </Card>
      </div>

      {/* web dashboards — present in the prototype so all three can be reviewed */}
      <div className="mt-6">
        <SectionTitle title="Partner dashboards" />
        <Card className="py-2">
          {[
            { label: "Expert dashboard", to: "/expert" },
            { label: "Factory dashboard", to: "/factory" },
            { label: "Admin dashboard", to: "/admin" },
          ].map((d) => (
            <Row
              key={d.to}
              icon={LayoutDashboard}
              label={d.label}
              note="Opens the responsive web view"
              onClick={() => navigate(d.to)}
            />
          ))}
        </Card>
      </div>

      <div className="mt-6">
        <Card className="py-2">
          {settingsRows.map((r) => (
            <Row key={r.label} icon={r.icon} label={r.label} />
          ))}
          <Row icon={LogOut} label="Log out" tone="clay" />
        </Card>
      </div>

      <p className="mt-6 text-center text-[12px] text-muted">
        Smart Farmer AI · v1.0 · Works offline
      </p>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  note,
  onClick,
  tone,
}: {
  icon: typeof Settings;
  label: string;
  note?: string;
  onClick?: () => void;
  tone?: "clay";
}) {
  return (
    <PressableCard
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-hair py-3.5 last:border-0"
    >
      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-2xl",
          tone === "clay" ? "bg-clay-wash text-clay" : "bg-wash text-leaf-dark",
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn("text-[14.5px] font-bold", tone === "clay" ? "text-clay" : "text-canopy")}>
          {label}
        </p>
        {note && <p className="truncate text-[12.5px] text-muted">{note}</p>}
      </div>
      <ChevronRight className="h-4.5 w-4.5 shrink-0 text-muted" />
    </PressableCard>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  note,
  value,
  onChange,
}: {
  icon: typeof Mic;
  label: string;
  note: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-hair py-3.5 last:border-0">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-wash text-leaf-dark">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14.5px] font-bold text-canopy">{label}</p>
        <p className="truncate text-[12.5px] text-muted">{note}</p>
      </div>
      <button
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
        className={cn(
          "relative h-8 w-14 shrink-0 rounded-full transition-colors duration-200",
          value ? "bg-leaf" : "bg-hair",
        )}
      >
        <motion.span
          layout
          transition={press}
          className={cn(
            "absolute top-1 h-6 w-6 rounded-full bg-white shadow-press",
            value ? "left-7" : "left-1",
          )}
        />
      </button>
    </div>
  );
}
