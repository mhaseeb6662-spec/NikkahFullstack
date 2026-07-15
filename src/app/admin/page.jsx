"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, Clock, Heart, Wallet, UserX, UserPlus, PartyPopper } from "lucide-react";
import Button from "@/components/Button";

const toneCls = {
  maroon: "bg-maroon-500/10 text-maroon-500",
  green: "bg-green-500/10 text-green-600",
  gold: "bg-gold-500/10 text-gold-600",
  rose: "bg-rose-500/10 text-rose-600",
};

const userStatusCls = {
  active: "bg-green-500/10 text-green-600",
  pending: "bg-gold-500/10 text-gold-600",
  suspended: "bg-rose-500/10 text-rose-600",
};

const paymentStatusCls = {
  approved: "bg-green-500/10 text-green-600",
  pending: "bg-gold-500/10 text-gold-600",
  rejected: "bg-rose-500/10 text-rose-600",
};

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, usersRes, paymentsRes] = await Promise.all([
          fetch("/api/admin/stats").then((r) => r.json()),
          fetch("/api/admin/users").then((r) => r.json()),
          fetch("/api/payments").then((r) => r.json()),
        ]);
        setStats(statsRes.stats || null);
        setRecentUsers((usersRes.users || []).slice(0, 5));
        setRecentPayments((paymentsRes.payments || []).slice(0, 5));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statCards = stats
    ? [
        { icon: Users, label: "Total Registered", value: stats.totalUsers.toLocaleString(), tone: "maroon" },
        { icon: UserCheck, label: "Active Profiles", value: stats.activeProfiles.toLocaleString(), tone: "green" },
        { icon: Clock, label: "Pending Profiles", value: stats.pendingProfiles.toLocaleString(), tone: "gold" },
        { icon: UserX, label: "Inactive Profiles", value: stats.inactiveProfiles.toLocaleString(), tone: "rose" },
        { icon: PartyPopper, label: "Successful Rishtas", value: stats.successfulRishtas.toLocaleString(), tone: "gold" },
        { icon: UserPlus, label: "New This Week", value: stats.recentRegistrations.toLocaleString(), tone: "green" },
        { icon: Wallet, label: "Pending Payments", value: stats.pendingPayments, tone: "gold" },
        { icon: Heart, label: "Pending Access Requests", value: stats.pendingAccessRequests, tone: "rose" },
        { icon: Wallet, label: "Paid Members", value: stats.paidUsers, tone: "maroon" },
      ]
    : [];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900 mb-1">Admin Overview</h1>
      <p className="text-ink-600 text-sm mb-8">A live snapshot of platform activity, straight from the database.</p>

      {loading && <p className="text-ink-400 text-sm mb-8">Loading stats...</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-8">
        {statCards.map(({ icon: Icon, label, value, tone }) => (
          <div key={label} className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-5">
            <span className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${toneCls[tone]}`}>
              <Icon size={19} />
            </span>
            <p className="font-display text-xl font-bold text-ink-900">{value}</p>
            <p className="text-xs text-ink-600 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-ink-900/5 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-ink-900">Recent Users</h3>
            <Button to="/admin/users" variant="ghost" size="sm">View All</Button>
          </div>
          <ul className="divide-y divide-ink-900/5">
            {recentUsers.map((u) => (
              <li key={u._id} className="px-5 py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-ink-900">{u.name}</p>
                  <p className="text-xs text-ink-400">{u.profileId} • {u.email}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${userStatusCls[u.status] || ""}`}>{u.status}</span>
              </li>
            ))}
            {!loading && recentUsers.length === 0 && (
              <li className="px-5 py-6 text-center text-ink-400 text-sm">No users yet.</li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-ink-900/5 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-ink-900">Recent Payments</h3>
            <Button to="/admin/payments" variant="ghost" size="sm">View All</Button>
          </div>
          <ul className="divide-y divide-ink-900/5">
            {recentPayments.map((p) => (
              <li key={p._id} className="px-5 py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-ink-900">{p.user?.name}</p>
                  <p className="text-xs text-ink-400">{p.transactionId} • {p.method}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${paymentStatusCls[p.status] || ""}`}>{p.status}</span>
              </li>
            ))}
            {!loading && recentPayments.length === 0 && (
              <li className="px-5 py-6 text-center text-ink-400 text-sm">No payments yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
