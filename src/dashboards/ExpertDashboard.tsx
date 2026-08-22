import { useState } from "react";
import { motion } from "motion/react";
import {
  CalendarDays, ClipboardList, Inbox, LayoutGrid, MessageSquare, Microscope,
  Star, Timer, UserRound, Users,
} from "lucide-react";
import { AreaChart, DashboardLayout, DonutChart, Panel, Pill, StatCard, Table } from "./DashboardLayout";
import { Pressable } from "@/motion/Pressable";
import type { NavItem } from "./DashboardLayout";

const nav: NavItem[] = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "requests", label: "Consultation requests", icon: Inbox, badge: 6 },
  { key: "appointments", label: "Appointments", icon: CalendarDays },
  { key: "farmers", label: "Farmers", icon: Users },
  { key: "cases", label: "Disease cases", icon: Microscope, badge: 3 },
  { key: "messages", label: "Messages", icon: MessageSquare },
  { key: "recommendations", label: "Recommendations", icon: ClipboardList },
  { key: "profile", label: "Profile", icon: UserRound },
];

const requests = [
  { farmer: "Sunil Kamble", village: "Hinganghat", crop: "Wheat", issue: "Leaf blight · AI 94%", waiting: "6 min", priority: "High" },
  { farmer: "Meera Jadhav", village: "Deoli", crop: "Tomato", issue: "Early blight · AI 71%", waiting: "18 min", priority: "High" },
  { farmer: "Piyush Rokade", village: "Wardha", crop: "Wheat", issue: "Nitrogen schedule", waiting: "42 min", priority: "Normal" },
  { farmer: "Ravi Thakre", village: "Seloo", crop: "Soybean", issue: "Pod fill delay", waiting: "1 hr", priority: "Normal" },
  { farmer: "Anita Bhoyar", village: "Arvi", crop: "Onion", issue: "Storage rot", waiting: "2 hr", priority: "Low" },
];

export default function ExpertDashboard() {
  const [active, setActive] = useState("overview");

  return (
    <DashboardLayout
      brand="Smart Farmer AI"
      role="Expert console"
      nav={nav}
      active={active}
      onNavigate={setActive}
      user={{ name: "Dr. Anjali Deshmukh", sub: "Plant pathology", hue: "#1B7A45" }}
    >
      <div className="mb-6">
        <h1 className="font-display text-[26px] font-extrabold text-canopy">Good morning, Dr. Deshmukh</h1>
        <p className="mt-1 text-[14px] text-muted">
          6 farmers are waiting, and 3 low-confidence AI scans need your eyes.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Inbox} label="Open requests" value="6" delta="+2 today" index={0} />
        <StatCard icon={Timer} label="Avg. response time" value="14 min" tone="sky" index={1} />
        <StatCard icon={Users} label="Farmers helped" value="312" tone="sun" index={2} />
        <StatCard icon={Star} label="Rating" value="4.9" delta="98% helpful" index={3} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Consultation requests"
          action={<Pressable size="sm" variant="tonal">View all</Pressable>}
        >
          <Table
            columns={["Farmer", "Crop", "Issue", "Waiting", "Priority", ""]}
            rows={requests.map((r) => [
              <div key="f">
                <p className="font-bold text-canopy">{r.farmer}</p>
                <p className="text-[12px] text-muted">{r.village}</p>
              </div>,
              r.crop,
              r.issue,
              r.waiting,
              <Pill key="p" tone={r.priority === "High" ? "clay" : r.priority === "Normal" ? "sun" : "muted"}>
                {r.priority}
              </Pill>,
              <Pressable key="a" size="sm">Accept</Pressable>,
            ])}
          />
        </Panel>

        <div className="flex flex-col gap-5">
          <Panel title="Cases by crop">
            <DonutChart
              segments={[
                { label: "Wheat", value: 42, color: "#1B7A45" },
                { label: "Cotton", value: 26, color: "#F5A524" },
                { label: "Soybean", value: 19, color: "#34C77B" },
                { label: "Vegetables", value: 13, color: "#8A6A4F" },
              ]}
            />
          </Panel>

          <Panel title="Today's appointments">
            {[
              { t: "11:00", n: "Ravi Thakre", k: "Video · Soybean" },
              { t: "13:30", n: "Meera Jadhav", k: "Voice · Tomato" },
              { t: "16:00", n: "Sunil Kamble", k: "Chat · Wheat" },
            ].map((a, i) => (
              <motion.div
                key={a.t}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 border-b border-hair py-3 last:border-0"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-wash font-display text-[13px] font-extrabold text-leaf-dark">
                  {a.t}
                </span>
                <div>
                  <p className="text-[14px] font-bold text-canopy">{a.n}</p>
                  <p className="text-[12px] text-muted">{a.k}</p>
                </div>
              </motion.div>
            ))}
          </Panel>
        </div>
      </div>

      <Panel title="Consultations handled" className="mt-5">
        <AreaChart
          data={[12, 18, 15, 24, 22, 31, 28]}
          labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
        />
      </Panel>
    </DashboardLayout>
  );
}
