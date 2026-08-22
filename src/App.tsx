import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import Home from "@/screens/Home";
import Scan from "@/screens/Scan";
import Assistant from "@/screens/Assistant";
import Recommend from "@/screens/Recommend";
import Farm from "@/screens/Farm";
import Weather from "@/screens/Weather";
import Market from "@/screens/Market";
import BuyerDetail from "@/screens/BuyerDetail";
import OrderTracking from "@/screens/OrderTracking";
import Transport from "@/screens/Transport";
import Earnings from "@/screens/Earnings";
import Experts from "@/screens/Experts";
import ExpertDetail from "@/screens/ExpertDetail";
import Profile from "@/screens/Profile";
import ExpertDashboard from "@/dashboards/ExpertDashboard";
import FactoryDashboard from "@/dashboards/FactoryDashboard";
import AdminDashboard from "@/dashboards/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* farmer app — mobile first */}
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="scan" element={<Scan />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="recommend" element={<Recommend />} />
          <Route path="farm" element={<Farm />} />
          <Route path="weather" element={<Weather />} />
          <Route path="market" element={<Market />} />
          <Route path="market/:id" element={<BuyerDetail />} />
          <Route path="orders/:id" element={<OrderTracking />} />
          <Route path="transport" element={<Transport />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="experts" element={<Experts />} />
          <Route path="experts/:id" element={<ExpertDetail />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* web consoles — desktop first, responsive down to mobile */}
        <Route path="/expert" element={<ExpertDashboard />} />
        <Route path="/factory" element={<FactoryDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
