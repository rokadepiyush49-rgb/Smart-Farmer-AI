import type { CropId } from "@/components/CropGlyph";

/**
 * Demo data for the prototype. Every field here is something the real system
 * derives from software sources only — farmer input, AI/CV models, weather and
 * satellite APIs, agricultural datasets, market feeds and experts.
 */

export const farmer = {
  name: "Piyush",
  village: "Wardha",
  district: "Wardha, Maharashtra",
  landAcres: 4.5,
  soil: "Medium Black (Vertisol)",
  currentCrop: "wheat" as CropId,
  previousCrop: "Soybean (Kharif 2025)",
  stage: "Tillering",
  stageIndex: 1,
  sownOn: "18 Nov",
  expectedHarvest: "24 Mar",
  languages: ["मराठी", "हिंदी", "English"],
};

export type Crop = { id: CropId; name: string; local: string; season: string };

export const crops: Crop[] = [
  { id: "wheat", name: "Wheat", local: "गहू", season: "Rabi" },
  { id: "rice", name: "Rice", local: "भात", season: "Kharif" },
  { id: "maize", name: "Maize", local: "मका", season: "Kharif" },
  { id: "tomato", name: "Tomato", local: "टोमॅटो", season: "Rabi" },
  { id: "potato", name: "Potato", local: "बटाटा", season: "Rabi" },
  { id: "soybean", name: "Soybean", local: "सोयाबीन", season: "Kharif" },
  { id: "cotton", name: "Cotton", local: "कापूस", season: "Kharif" },
  { id: "onion", name: "Onion", local: "कांदा", season: "Rabi" },
];

export const cropHealth: Record<string, {
  status: "Healthy" | "Watch" | "At risk";
  confidence: number;
  note: string;
  issue?: string;
  scannedAgo: string;
}> = {
  wheat:   { status: "Healthy", confidence: 94, note: "Canopy colour and leaf texture look normal for tillering.", scannedAgo: "2 days ago" },
  rice:    { status: "Watch",   confidence: 88, note: "Early signs of leaf yellowing on the lower canopy.", issue: "Possible nitrogen stress", scannedAgo: "5 days ago" },
  maize:   { status: "Healthy", confidence: 91, note: "Growth on track for the sowing date you entered.", scannedAgo: "1 week ago" },
  tomato:  { status: "At risk", confidence: 89, note: "Leaf spots detected on 3 of 5 photos you uploaded.", issue: "Early blight suspected", scannedAgo: "Yesterday" },
  potato:  { status: "Healthy", confidence: 93, note: "No disease signature found in your last scan.", scannedAgo: "3 days ago" },
  soybean: { status: "Watch",   confidence: 86, note: "Pod formation slightly behind the district average.", issue: "Delayed pod fill", scannedAgo: "4 days ago" },
  cotton:  { status: "Healthy", confidence: 90, note: "Boll development looks even across your photos.", scannedAgo: "6 days ago" },
  onion:   { status: "Healthy", confidence: 92, note: "Bulb sizing on schedule for a March harvest.", scannedAgo: "2 days ago" },
};

export const weather = {
  temp: 24,
  condition: "Sunny",
  feels: 26,
  rainChance: 12,
  humidity: 48,
  wind: 9,
  advice: "Good weather for field activities today. Spraying window is open until 11 AM.",
  week: [
    { day: "Today", icon: "sun",   hi: 24, lo: 14, rain: 12 },
    { day: "Sun",   icon: "sun",   hi: 26, lo: 15, rain: 8 },
    { day: "Mon",   icon: "cloud", hi: 25, lo: 16, rain: 30 },
    { day: "Tue",   icon: "rain",  hi: 22, lo: 15, rain: 78 },
    { day: "Wed",   icon: "rain",  hi: 21, lo: 14, rain: 65 },
    { day: "Thu",   icon: "cloud", hi: 23, lo: 14, rain: 25 },
    { day: "Fri",   icon: "sun",   hi: 25, lo: 13, rain: 10 },
  ] as const,
};

export type Advisory = {
  id: string;
  kind: "weather" | "crop" | "market" | "irrigation";
  title: string;
  body: string;
  action: string;
  to?: string;
};

export const advisories: Advisory[] = [
  {
    id: "a1",
    kind: "weather",
    title: "Rain expected Tuesday",
    body: "78% chance of rain in Wardha on Tuesday.",
    action: "Avoid pesticide spraying today — it will wash off.",
  },
  {
    id: "a2",
    kind: "irrigation",
    title: "Irrigation advisory",
    body: "Estimated soil water balance is at 42% of field capacity.",
    action: "Apply about 22 mm of water on Thursday, after the rain passes.",
  },
  {
    id: "a3",
    kind: "crop",
    title: "Crop stage change",
    body: "Your wheat is entering the tillering stage.",
    action: "Review nitrogen split-dose activities for this week.",
    to: "/farm",
  },
  {
    id: "a4",
    kind: "market",
    title: "Market opportunity",
    body: "Wheat is trading at ₹2,450/quintal in Wardha, 6% above last month.",
    action: "Two verified buyers are looking for your grade right now.",
    to: "/market",
  },
];

export type Buyer = {
  id: string;
  company: string;
  kind: string;
  crop: CropId;
  cropName: string;
  price: number;
  quantity: string;
  grade: string;
  delivery: string;
  distanceKm: number;
  rating: number;
  verified: boolean;
  quality: string[];
  terms: string[];
};

export const buyers: Buyer[] = [
  {
    id: "b1", company: "Anandvan Foods", kind: "Flour mill", crop: "wheat", cropName: "Wheat",
    price: 2450, quantity: "20 tons", grade: "A", delivery: "12 Sept", distanceKm: 18, rating: 4.8, verified: true,
    quality: ["Moisture ≤ 12%", "Foreign matter ≤ 1%", "Uniform grain size"],
    terms: ["Pickup from farm gate", "Payment within 48 hours", "Weighing at factory"],
  },
  {
    id: "b2", company: "Sahyadri Agro Mills", kind: "Processing unit", crop: "wheat", cropName: "Wheat",
    price: 2385, quantity: "50 tons", grade: "A/B", delivery: "18 Sept", distanceKm: 42, rating: 4.6, verified: true,
    quality: ["Moisture ≤ 13%", "No visible pest damage"],
    terms: ["Farmer arranges transport", "Payment on delivery"],
  },
  {
    id: "b3", company: "Vidarbha Grain Co.", kind: "Bulk trader", crop: "soybean", cropName: "Soybean",
    price: 4720, quantity: "12 tons", grade: "A", delivery: "9 Sept", distanceKm: 26, rating: 4.4, verified: true,
    quality: ["Oil content ≥ 18%", "Moisture ≤ 10%"],
    terms: ["Pickup from farm gate", "Payment within 24 hours"],
  },
  {
    id: "b4", company: "Green Harvest Pvt Ltd", kind: "Export house", crop: "onion", cropName: "Onion",
    price: 1890, quantity: "30 tons", grade: "A", delivery: "22 Sept", distanceKm: 61, rating: 4.9, verified: true,
    quality: ["Bulb diameter 45–65 mm", "No sprouting", "Cured 10+ days"],
    terms: ["Cold-chain pickup", "Payment within 72 hours"],
  },
  {
    id: "b5", company: "Nagpur Cotton Works", kind: "Ginning mill", crop: "cotton", cropName: "Cotton",
    price: 7350, quantity: "8 tons", grade: "B", delivery: "28 Sept", distanceKm: 74, rating: 4.2, verified: false,
    quality: ["Staple length ≥ 28 mm", "Trash ≤ 4%"],
    terms: ["Farmer arranges transport", "Payment within 7 days"],
  },
];

export type Expert = {
  id: string;
  name: string;
  qual: string;
  spec: string;
  years: number;
  rating: number;
  reviews: number;
  languages: string[];
  online: boolean;
  fee: number;
  hue: string;
};

export const experts: Expert[] = [
  { id: "e1", name: "Dr. Anjali Deshmukh", qual: "PhD, Plant Pathology", spec: "Fungal & bacterial crop disease", years: 14, rating: 4.9, reviews: 312, languages: ["मराठी", "हिंदी", "English"], online: true, fee: 0, hue: "#1B7A45" },
  { id: "e2", name: "Rajesh Patil", qual: "MSc Agronomy · KVK", spec: "Soil health & nutrient planning", years: 9, rating: 4.7, reviews: 188, languages: ["मराठी", "हिंदी"], online: true, fee: 99, hue: "#8A6A4F" },
  { id: "e3", name: "Dr. Sneha Kulkarni", qual: "PhD Horticulture", spec: "Vegetables & orchard management", years: 11, rating: 4.8, reviews: 241, languages: ["मराठी", "English"], online: false, fee: 149, hue: "#F5A524" },
  { id: "e4", name: "Imran Shaikh", qual: "BSc Agri · Extension Officer", spec: "Cotton & pest management", years: 7, rating: 4.5, reviews: 96, languages: ["हिंदी", "English"], online: true, fee: 0, hue: "#3B93E0" },
];

export const diseaseResult = {
  name: "Wheat Leaf Blight",
  scientific: "Bipolaris sorokiniana",
  confidence: 94,
  severity: 38,
  severityLabel: "Moderate",
  affected: "About 38% of leaf area in the photo",
  summary:
    "A fungal disease that spreads fast in warm, humid weather. Caught at this stage it is very treatable.",
  symptoms: [
    "Oval tan lesions with yellow halos on leaves",
    "Spots joining together into large dry patches",
    "Lower leaves drying from the tip downwards",
  ],
  chemical: {
    title: "Recommended treatment",
    lines: [
      "Propiconazole 25% EC — 1 ml per litre of water",
      "Spray in the evening, cover both leaf surfaces",
      "Repeat after 12–14 days if new spots appear",
    ],
  },
  organic: {
    title: "Organic option",
    lines: [
      "Trichoderma viride 1% WP — 5 g per litre",
      "Neem oil 1500 ppm — 3 ml per litre, weekly",
      "Remove and burn badly infected lower leaves",
    ],
  },
  prevention: [
    "Use certified, treated seed next season",
    "Rotate with a non-cereal crop such as chickpea",
    "Avoid overhead irrigation late in the day",
  ],
  alternatives: [
    { name: "Septoria leaf blotch", p: 4 },
    { name: "Tan spot", p: 2 },
  ],
};

export type RankedCrop = {
  id: CropId;
  name: string;
  suitability: number;
  yield: string;
  netProfit: number;
  duration: string;
  outlook: "Strong" | "Stable" | "Volatile";
  risk: "Low" | "Medium" | "High";
  why: { label: string; weight: number }[];
};

/** Ranked by expected NET INCOME, not by yield alone. */
export const rankedCrops: RankedCrop[] = [
  {
    id: "soybean", name: "Soybean", suitability: 94, yield: "14.2 q/acre", netProfit: 41200,
    duration: "95–105 days", outlook: "Strong", risk: "Low",
    why: [
      { label: "Rainfall 780 mm suits soybean", weight: 92 },
      { label: "Soil pH 6.8 is in the ideal band", weight: 84 },
      { label: "Forecast price ₹4,720/q at harvest", weight: 78 },
      { label: "Low nitrogen need cuts input cost", weight: 61 },
    ],
  },
  {
    id: "cotton", name: "Cotton", suitability: 88, yield: "9.6 q/acre", netProfit: 37500,
    duration: "160–180 days", outlook: "Volatile", risk: "Medium",
    why: [
      { label: "Black soil holds moisture well", weight: 89 },
      { label: "Strong local ginning demand", weight: 72 },
      { label: "Price swings raise income risk", weight: 55 },
    ],
  },
  {
    id: "maize", name: "Maize", suitability: 81, yield: "22.4 q/acre", netProfit: 28900,
    duration: "100–110 days", outlook: "Stable", risk: "Low",
    why: [
      { label: "Highest raw yield of the three", weight: 95 },
      { label: "Steady feed-industry demand", weight: 70 },
      { label: "Higher fertiliser cost per acre", weight: 48 },
    ],
  },
];

export type OrderStep = { label: string; note: string; done: boolean; current?: boolean };

export const order = {
  id: "SF-2481",
  crop: "Wheat",
  buyer: "Anandvan Foods",
  quantity: "8 tons",
  amount: 196000,
  steps: [
    { label: "Offer accepted", note: "2 Sept · ₹2,450 per quintal", done: true },
    { label: "Transport booked", note: "3 Sept · Vidarbha Logistics", done: true },
    { label: "Pickup scheduled", note: "6 Sept · 9:00 AM at farm gate", done: true },
    { label: "In transit", note: "Arriving in about 2 hours", done: false, current: true },
    { label: "Delivered", note: "Awaiting factory weighing", done: false },
    { label: "Payment received", note: "Expected within 48 hours", done: false },
  ] as OrderStep[],
};

export const earnings = {
  total: 48500,
  pending: 21400,
  completed: 27100,
  month: 48500,
  transactions: [
    { id: "t1", label: "Wheat sale · Anandvan Foods", amount: 27100, status: "Completed", date: "2 Sept" },
    { id: "t2", label: "Soybean sale · Vidarbha Grain", amount: 21400, status: "Pending", date: "28 Aug" },
    { id: "t3", label: "Onion sale · Green Harvest", amount: 18250, status: "Completed", date: "14 Aug" },
    { id: "t4", label: "Expert consultation fee", amount: -99, status: "Completed", date: "11 Aug" },
  ],
};

export const suggestedQuestions = [
  { icon: "🌾", text: "Which crop should I grow next season?" },
  { icon: "🐛", text: "What is wrong with my plant?" },
  { icon: "💧", text: "When should I irrigate my wheat?" },
  { icon: "🌦", text: "Will it rain this week?" },
  { icon: "💰", text: "What is today's market price?" },
  { icon: "👨‍🌾", text: "I want to talk to an expert" },
];
