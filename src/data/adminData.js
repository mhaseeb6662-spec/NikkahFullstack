import { profiles } from "./profiles";

export const paymentAccounts = [
  {
    id: 1,
    type: "Bank Account",
    label: "Meezan Bank — Nikah Manzil (Pvt) Ltd",
    details: "Account #: 0110-1234567-001 · IBAN: PK36MEZN0001101234567001",
  },
  {
    id: 2,
    type: "Mobile Wallet",
    label: "JazzCash",
    details: "0300-1234567 — Nikah Manzil Services",
  },
  {
    id: 3,
    type: "Mobile Wallet",
    label: "EasyPaisa",
    details: "0300-1234567 — Nikah Manzil Services",
  },
];

export const adminUsers = profiles.slice(0, 14).map((p, i) => ({
  id: p.id,
  name: p.name,
  email: `${p.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
  gender: p.gender,
  city: p.city,
  status: p.verified ? "Active" : i % 3 === 0 ? "Pending" : "Suspended",
  joined: `2026-0${(i % 6) + 1}-${10 + (i % 15)}`,
}));

export const adminPayments = profiles.slice(0, 10).map((p, i) => ({
  id: `TXN-${5000 + i}`,
  userId: p.id,
  name: p.name,
  amount: 1000,
  method: ["JazzCash", "EasyPaisa", "Bank Transfer"][i % 3],
  status: i % 4 === 0 ? "Pending" : i % 4 === 1 ? "Rejected" : "Approved",
  date: `2026-0${(i % 6) + 1}-${5 + (i % 20)}`,
}));

export const accessRequests = profiles.slice(0, 8).map((p, i) => ({
  id: i + 1,
  fromUser: profiles[(i + 5) % profiles.length].name,
  toProfile: p.id,
  toName: p.name,
  status: i % 3 === 0 ? "Pending" : i % 3 === 1 ? "Approved" : "Denied",
  requestedOn: `2026-06-${10 + i}`,
}));

export const dashboardStats = {
  totalUsers: 1248,
  activeProfiles: 864,
  pendingPayments: adminPayments.filter((p) => p.status === "Pending").length,
  successStories: 132,
  revenueThisMonth: 186000,
};
