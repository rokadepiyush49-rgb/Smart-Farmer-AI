import { useState } from "react";
import { motion } from "motion/react";
import {
  BarChart3, ClipboardList, LayoutGrid, Package, ShoppingCart, Store,
  Truck, Users, Wallet,
} from "lucide-react";
import { AreaChart, DashboardLayout, Panel, Pill, StatCard, Table } from "./DashboardLayout";
import { Pressable } from "@/motion/Pressable";
import type { NavItem } from "./DashboardLayout";

const nav: NavItem[] = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "requirements", label: "Requirements", icon: ClipboardList },
  { key: "marketplace", label: "Marketplace", icon: Store },
  { key: "orders", label: "Orders", icon: ShoppingCart, badge: 4 },
  { key: "farmers", label: "Farmers", icon: Users },
  { key: "deliveries", label: "Deliveries", icon: Truck, badge: 2 },
  { key: "payments", label: "Payments", icon: Wallet },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
];

const orders = [
  { id: "SF-2481", farmer: "Piyush Rokade", crop: "Wheat", qty: "8 t", grade: "A", price: "₹2,450", status: "In transit" },
  { id: "SF-2477", farmer: "Sunil Kamble", crop: "Wheat", qty: "12 t", grade: "A", price: "₹2,450", status: "Delivered" },
  { id: "SF-2469", farmer: "Anita Bhoyar", crop: "Wheat", qty: "6 t", grade: "B", price: "₹2,310", status: "Payment due" },
  { id: "SF-2461", farmer: "Ravi Thakre", crop: "Wheat", qty: "15 t", grade: "A", price: "₹2,450", status: "Completed" },
];

const statusTone = {
  "In transit": "sky",
  Delivered: "sun",
  "Payment due": "clay",
  Completed: "leaf",
} as const;

export default function FactoryDashboard() {
  const [active, setActive] = useState("overview");

  return (
    <DashboardLayout
      brand="Anandvan Foods"
      role="Factory console"
      nav={nav}
      active={active}
      onNavigate={setActive}
      user={{ name: "Anandvan Foods", sub: "Verified buyer", hue: "#8A6A4F" }}
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] font-extrabold text-canopy">Procurement overview</h1>
          <p className="mt-1 text-[14px] text-muted">
            Buying directly from 84 verified farmers across Wardha district.
          </p>
        </div>
        <Pressable size="md">
          <ClipboardList className="h-4.5 w-4.5" /> Publish requirement
        </Pressable>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Package} label="Open requirement" value="120 t" delta="wheat" index={0} />
        <StatCard icon={ShoppingCart} label="Active orders" value="4" tone="sky" index={1} />
        <StatCard icon={Users} label="Registered farmers" value="84" tone="sun" index={2} />
        <StatCard icon={Wallet} label="Paid this month" value="₹18.4L" index={3} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Panel title="Recent orders" action={<Pressable size="sm" variant="tonal">Export</Pressable>}>
          <Table
            columns={["Order", "Farmer", "Crop", "Qty", "Grade", "Price", "Status"]}
            rows={orders.map((o) => [
              <span key="i" className="font-bold text-canopy">{o.id}</span>,
              o.farmer,
              o.crop,
              o.qty,
              <Pill key="g" tone={o.grade === "A" ? "leaf" : "muted"}>{o.grade}</Pill>,
              o.price,
              <Pill key="s" tone={statusTone[o.status as keyof typeof statusTone]}>{o.status}</Pill>,
            ])}
          />
        </Panel>

        <Panel title="Live requirement">
          <div className="rounded-[20px] bg-cream p-4">
            <p className="text-[12px] font-bold uppercase tracking-wide text-muted">Wheat · Grade A</p>
            <p className="mt-1.5 font-display text-[28px] font-extrabold leading-none text-canopy">
              ₹2,450 <span className="text-[14px] font-bold text-muted">/ quintal</span>
            </p>

            <div className="mt-4">
              <div className="mb-2 flex justify-between text-[12.5px] font-semibold">
                <span className="text-muted">Filled</span>
                <span className="text-canopy">41 of 120 tons</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-hair">
                <motion.div
                  className="h-full rounded-full bg-leaf"
                  initial={{ width: 0 }}
                  animate={{ width: "34%" }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                />
              </div>
            </div>

            <div className="mt-4 space-y-1.5 text-[13px] text-canopy-70">
              <p>· Moisture ≤ 12%</p>
              <p>· Foreign matter ≤ 1%</p>
              <p>· Delivery by 12 September</p>
            </div>
          </div>

          <div className="mt-4 rounded-[20px] bg-wash p-4">
            <p className="text-[13px] font-bold text-leaf-dark">17 traceable lots offered</p>
            <p className="mt-1 text-[12.5px] leading-snug text-canopy-70">
              Each lot carries its sowing date, treatments and AI scan history — you can verify
              quality before you bid.
            </p>
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel title="Procurement volume (tons)">
          <AreaChart
            data={[38, 44, 41, 62, 58, 71, 84]}
            labels={["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]}
            color="#8A6A4F"
          />
        </Panel>
        <Panel title="Deliveries in progress">
          {[
            { id: "SF-2481", who: "Piyush Rokade", eta: "2 hours", pct: 68 },
            { id: "SF-2483", who: "Kavita Ingle", eta: "Tomorrow 10 AM", pct: 22 },
          ].map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="mb-4 last:mb-0"
            >
              <div className="mb-2 flex items-center gap-2">
                <Truck className="h-4 w-4 text-leaf" />
                <p className="text-[14px] font-bold text-canopy">{d.who}</p>
                <span className="ml-auto text-[12.5px] text-muted">ETA {d.eta}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-hair">
                <motion.div
                  className="h-full rounded-full bg-sun"
                  initial={{ width: 0 }}
                  animate={{ width: `${d.pct}%` }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </Panel>
      </div>
    </DashboardLayout>
  );
}
