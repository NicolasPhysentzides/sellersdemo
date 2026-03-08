import type { SalesLine } from "@/app/dashboard/sales-table";

export interface SellerUser {
  id: number;
  name: string;
  email: string;
  spCode: string;
  role: string;
}

const DELPHI_EPOCH_MS = new Date(1899, 11, 30).getTime();

function dateToDelphi(year: number, month: number, day: number): number {
  return Math.round(
    (new Date(year, month - 1, day).getTime() - DELPHI_EPOCH_MS) / 86400000
  );
}

export const DEMO_SELLERS: SellerUser[] = [
  { id: 1,  name: "Πωλητής 01", email: "seller01@demo.com", spCode: "Π01", role: "seller" },
  { id: 2,  name: "Πωλητής 02", email: "seller02@demo.com", spCode: "Π02", role: "seller" },
  { id: 3,  name: "Πωλητής 03", email: "seller03@demo.com", spCode: "Π03", role: "seller" },
  { id: 4,  name: "Πωλητής 04", email: "seller04@demo.com", spCode: "Π04", role: "seller" },
  { id: 5,  name: "Πωλητής 05", email: "seller05@demo.com", spCode: "Π05", role: "seller" },
  { id: 6,  name: "Πωλητής 06", email: "seller06@demo.com", spCode: "Π06", role: "seller" },
  { id: 7,  name: "Πωλητής 07", email: "seller07@demo.com", spCode: "Π07", role: "seller" },
  { id: 8,  name: "Πωλητής 08", email: "seller08@demo.com", spCode: "Π08", role: "seller" },
  { id: 9,  name: "Πωλητής 09", email: "seller09@demo.com", spCode: "Π09", role: "seller" },
  { id: 10, name: "Πωλητής 10", email: "seller10@demo.com", spCode: "Π10", role: "seller" },
  { id: 11, name: "Πωλητής 11", email: "seller11@demo.com", spCode: "Π11", role: "seller" },
  { id: 12, name: "Πωλητής 12", email: "seller12@demo.com", spCode: "Π12", role: "seller" },
  { id: 13, name: "Πωλητής 13", email: "seller13@demo.com", spCode: "Π13", role: "seller" },
  { id: 14, name: "Πωλητής 14", email: "seller14@demo.com", spCode: "Π14", role: "seller" },
  { id: 15, name: "Πωλητής 15", email: "seller15@demo.com", spCode: "Π15", role: "seller" },
  { id: 16, name: "Πωλητής 16", email: "seller16@demo.com", spCode: "Π16", role: "seller" },
  { id: 17, name: "Πωλητής 17", email: "seller17@demo.com", spCode: "Π17", role: "seller" },
  { id: 18, name: "Πωλητής 18", email: "seller18@demo.com", spCode: "Π18", role: "seller" },
  { id: 19, name: "Πωλητής 19", email: "seller19@demo.com", spCode: "Π19", role: "seller" },
  { id: 20, name: "Πωλητής 20", email: "seller20@demo.com", spCode: "Π20", role: "seller" },
];

const CUSTOMERS: { code: number; name: string }[] = [
  { code: 10001, name: "Sample Customer Alpha" },
  { code: 10002, name: "Sample Customer Beta" },
  { code: 10003, name: "Sample Customer Gamma" },
  { code: 10004, name: "Sample Customer Delta" },
  { code: 10005, name: "Sample Customer Epsilon" },
  { code: 10006, name: "Sample Customer Zeta" },
  { code: 10007, name: "Sample Customer Eta" },
  { code: 10008, name: "Sample Customer Theta" },
  { code: 10009, name: "Sample Customer Iota" },
  { code: 10010, name: "Sample Customer Kappa" },
  { code: 10011, name: "Sample Customer Lambda" },
  { code: 10012, name: "Sample Customer Mu" },
  { code: 10013, name: "Sample Customer Nu" },
  { code: 10014, name: "Sample Customer Xi" },
  { code: 10015, name: "Sample Customer Omicron" },
  { code: 10016, name: "Sample Customer Pi" },
  { code: 10017, name: "Sample Customer Rho" },
  { code: 10018, name: "Sample Customer Sigma" },
  { code: 10019, name: "Sample Customer Tau" },
  { code: 10020, name: "Sample Customer Upsilon" },
  { code: 10021, name: "Sample Customer Phi" },
  { code: 10022, name: "Sample Customer Chi" },
  { code: 10023, name: "Sample Customer Psi" },
  { code: 10024, name: "Sample Customer Omega" },
  { code: 10025, name: "Sample Customer Prime" },
];

const ITEMS: { code: string; name: string }[] = [
  { code: "PRD-001", name: "Office Desk Pro 160cm" },
  { code: "PRD-002", name: "Ergonomic Chair Executive" },
  { code: "PRD-003", name: "Monitor Stand Adjustable" },
  { code: "PRD-004", name: "Wireless Keyboard & Mouse Set" },
  { code: "PRD-005", name: "27\" 4K Display Monitor" },
  { code: "PRD-006", name: "Laptop Docking Station" },
  { code: "PRD-007", name: "Filing Cabinet 3-Drawer" },
  { code: "PRD-008", name: "Whiteboard 120x90cm" },
  { code: "PRD-009", name: "Projector HD 3500 Lumens" },
  { code: "PRD-010", name: "Conference Table 8-Seat" },
  { code: "PRD-011", name: "Mesh Task Chair" },
  { code: "PRD-012", name: "Bookcase 5-Shelf Oak" },
  { code: "PRD-013", name: "LED Desk Lamp Pro" },
  { code: "PRD-014", name: "Paper Shredder Cross-Cut" },
  { code: "PRD-015", name: "Printer Laser A4 Mono" },
  { code: "PRD-016", name: "Printer Inkjet Color A3" },
  { code: "PRD-017", name: "Stapler Heavy Duty" },
  { code: "PRD-018", name: "Storage Box Set x10" },
  { code: "PRD-019", name: "Notebook Hardcover A4 x5" },
  { code: "PRD-020", name: "Ballpoint Pen Box x50" },
  { code: "PRD-021", name: "Whiteboard Markers x12" },
  { code: "PRD-022", name: "Sticky Notes Multicolor x10" },
  { code: "PRD-023", name: "Folder A4 Rigid x20" },
  { code: "PRD-024", name: "Desk Organiser Bamboo" },
  { code: "PRD-025", name: "Waste Bin 30L Metal" },
  { code: "PRD-026", name: "Cable Management Kit" },
  { code: "PRD-027", name: "Laptop Bag 15.6\" Premium" },
  { code: "PRD-028", name: "USB-C Hub 7-Port" },
  { code: "PRD-029", name: "Webcam HD 1080p" },
  { code: "PRD-030", name: "Headset Wireless Pro" },
];

// Date pool: trailing 12 months ending today (every 3 days)
const TODAY = new Date();
const DATE_POOL: number[] = (() => {
  const dates: number[] = [];
  const endMonth0 = TODAY.getMonth();   // 0-based
  const endYear   = TODAY.getFullYear();
  const startMonth0 = (endMonth0 + 1) % 12; // first month of the 12-month window, 0-based
  const startYear   = endMonth0 === 11 ? endYear : endYear - 1;

  for (let i = 0; i < 12; i++) {
    const month0 = (startMonth0 + i) % 12;            // 0-based
    const year   = (startMonth0 + i) >= 12 ? endYear : startYear;
    const month1 = month0 + 1;                         // 1-based for Date
    const daysInMonth = new Date(year, month1, 0).getDate();
    // Cap the current month at today's day so no future dates appear
    const maxDay = (year === endYear && month0 === endMonth0)
      ? TODAY.getDate()
      : daysInMonth;
    for (let d = 1; d <= maxDay; d += 3) {
      dates.push(dateToDelphi(year, month1, d));
    }
  }
  return dates;
})();

// Unit prices per item (index-aligned with ITEMS array)
const UNIT_PRICES = [
  349, 299,  89, 129, 599, 249, 199, 149, 799, 699,  // PRD-001 – PRD-010
  179, 299,  45,  79, 399, 449,  12,  35,  28,  15,  // PRD-011 – PRD-020
   18,   9,  22,  49,  39,  29,  85,  55,  99, 189,  // PRD-021 – PRD-030
];

const SELLER_LINE_COUNTS = [72, 58, 83, 45, 67, 91, 54, 76, 48, 63, 88, 41, 70, 55, 79, 44, 62, 68, 75, 52];

// Per-seller unique customer counts (deterministic, varied 8–24)
const UNIQUE_CUSTOMERS_PER_SELLER = [12, 18, 9, 22, 15, 20, 11, 17, 14, 19, 21, 10, 16, 13, 23, 8, 24, 12, 18, 15];

function generateSalesLines(sellerId: number, count: number): SalesLine[] {
  const lines: SalesLine[] = [];
  const maxCust = UNIQUE_CUSTOMERS_PER_SELLER[sellerId - 1] ?? 15;
  for (let i = 0; i < count; i++) {
    const custIdx = Math.abs((sellerId * 17 + i * 31 + (i * sellerId) % 19 + Math.floor(i / 7) * 11)) % maxCust;
    const itemIdx = Math.abs((sellerId * 53 + i * 17 + (i + 3) * 11)) % ITEMS.length;
    const dateIdx = Math.abs((sellerId * 29 + i * 19 + (i % 5) * 23)) % DATE_POOL.length;
    const qty = 1 + Math.abs((sellerId * 73 + i * 43 + itemIdx * 29) % 5); // 1–5 units
    lines.push({
      customer_code: CUSTOMERS[custIdx].code,
      customer_name: CUSTOMERS[custIdx].name,
      item_code: ITEMS[itemIdx].code,
      item_name: ITEMS[itemIdx].name,
      trndate_line: DATE_POOL[dateIdx],
      line_value: qty * UNIT_PRICES[itemIdx],
    });
  }
  return lines.sort((a, b) => (b.trndate_line ?? 0) - (a.trndate_line ?? 0));
}

export const DEMO_SALES_LINES: Record<string, SalesLine[]> = Object.fromEntries(
  DEMO_SELLERS.map((seller, idx) => [
    seller.spCode,
    generateSalesLines(seller.id, SELLER_LINE_COUNTS[idx]),
  ])
);

export const TOTAL_DEMO_LINES = SELLER_LINE_COUNTS.reduce((a, b) => a + b, 0);

export const TOTAL_DEMO_VALUE = Object.values(DEMO_SALES_LINES).reduce(
  (sum, lines) => sum + lines.reduce((s, l) => s + (l.line_value ?? 0), 0),
  0
);
