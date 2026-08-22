import { useState } from "react";
import {
  Activity, BarChart3, Building2, LayoutGrid, ScrollText, Settings,
  ShoppingCart, Sprout, Stethoscope, Users, Wallet,
} from "lucide-react";
import { AreaChart, DashboardLayout, DonutChart, Panel, Pill, StatCard, Table } from "./DashboardLayout";
import type { NavItem } from "./DashboardLayout";

const nav: NavItem[] = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "users", label: "Users", icon: Users },
  { key: "farmers", label: "Farmers", icon: Sprout },
  { key: "experts", label: "Experts", icon: Stethoscope },
  { key: "factories", label: "Factories", icon: Building2 },
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "marketplace", label: "Marketplace", icon: BarChart3 },
  { key: "reports", label: "Reports", icon: ScrollText },
  { key: "settings", label: "Settings", icon: Settings },
];

const recent = [
  { who: "Kavita Ingle", role: "Farmer", place: "Arvi", when: "3 min ago", status: "Active" },
  { who: "Sahyadri Agro Mills", role: "Factory", place: "Nagpur", when: "1 hr ago", status: "Pending" },
  { who: "Dr. Sneha Kulkarni", role: "Expert", place: "Wardha", when: "4 hr ago", status: "Active" },
  { who: "Ramesh Wankhede", role: "Farmer", place: "Seloo", when: "6 hr ago", status: "Active" },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");

  return (
    <DashboardLayout
      brand="Smart Farmer AI"
      role="Platform admin"
      nav={nav}
      active={active}
      onNavigate={setActive}
      user={{ name: "Admin", sub: "Platform team", hue: "#0F3D2E" }}
    >
      <div className="mb-6">
        <h1 className="font-display text-[26px] font-extrabold text-canopy">Platform overview</h1>
        <p className="mt-1 text-[14px] text-muted">
          Everything moving through Smart Farmer AI right now.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Sprout} label="Total farmers" value="12,480" delta="+318 this week" index={0} />
        <StatCard icon={Stethoscope} label="Experts" value="146" tone="sky" index={1} />
        <StatCard icon={Building2} label="Factories & buyers" value="92" tone="sun" index={2} />
        <StatCard icon={ShoppingCart} label="Active orders" value="341" tone="clay" index={3} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Activity} label="AI scans this month" value="38,204" index={4} />
        <StatCard icon={Stethoscope} label="Consultations" value="2,911" tone="sky" index={5} />
        <StatCard icon={BarChart3} label="Marketplace listings" value="1,764" tone="sun" index={6} />
        <StatCard icon={Wallet} label="Payments settled" value="₹7.8 Cr" index={7} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Panel title="Platform activity">
          <AreaChart
            data={[1240, 1580, 1490, 2120, 2460, 2890, 3180]}
            labels={["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]}
          />
        </Panel>
        <Panel title="Where farmers spend time">
          <DonutChart
            segments={[
              { label: "Disease detection", value: 38, color: "#1B7A45" },
              { label: "Marketplace", value: 27, color: "#F5A524" },
              { label: "AI assistant", value: 21, color: "#34C77B" },
              { label: "Consultations", value: 14, color: "#3B93E0" },
            ]}
          />
        </Panel>
      </div>

      <Panel title="Recent registrations" className="mt-5">
        <Table
          columns={["Name", "Role", "District", "Joined", "Status"]}
          rows={recent.map((r) => [
            <span key="n" className="font-bold text-canopy">{r.who}</span>,
            <Pill key="r" tone={r.role === "Farmer" ? "leaf" : r.role === "Expert" ? "sky" : "sun"}>
              {r.role}
            </Pill>,
            r.place,
            r.when,
            <Pill key="s" tone={r.status === "Active" ? "leaf" : "muted"}>{r.status}</Pill>,
          ])}
        />
      </Panel>
    </DashboardLayout>
  );
}
