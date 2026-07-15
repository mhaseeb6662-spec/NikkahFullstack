"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, CheckCircle2, XCircle, Image as ImageIcon } from "lucide-react";
import { Input, Select } from "@/components/FormFields";

const statusCls = {
  approved: "bg-green-500/10 text-green-600",
  pending: "bg-gold-500/10 text-gold-600",
  rejected: "bg-rose-500/10 text-rose-600",
};

const statusLabel = { approved: "Approved", pending: "Pending", rejected: "Rejected" };

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [busyId, setBusyId] = useState(null);
  const [preview, setPreview] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payments");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payments load nahi ho sakin.");
      setPayments(data.payments || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchesQ =
        !q ||
        p.user?.name?.toLowerCase().includes(q) ||
        p.user?.profileId?.toLowerCase().includes(q) ||
        p.transactionId?.toLowerCase().includes(q);
      const matchesStatus = status === "all" || p.status === status;
      return matchesQ && matchesStatus;
    });
  }, [payments, query, status]);

  const totalApproved = payments.filter((p) => p.status === "approved").reduce((s, p) => s + (p.amount || 0), 0);

  const setPaymentStatus = async (id, newStatus) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/payments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update nahi ho saka.");
      setPayments((prev) => prev.map((p) => (p._id === id ? { ...p, status: data.payment.status } : p)));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900 mb-1">Payment Management</h1>
      <p className="text-ink-600 text-sm mb-6">
        Review and approve registration fee payments. Approving here also activates the member's profile.
      </p>

      <div className="bg-gradient-to-br from-maroon-500 to-rose-600 rounded-2xl p-6 text-white mb-6 max-w-sm">
        <p className="text-white/80 text-sm">Total Approved Revenue</p>
        <p className="font-display text-3xl font-bold mt-1">PKR {totalApproved.toLocaleString()}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <Input className="pl-10" placeholder="Search by name or transaction ID..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Select className="sm:w-48" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </Select>
      </div>

      {error && (
        <p className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">{error}</p>
      )}

      <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-400 text-xs uppercase tracking-wide">
                <th className="px-6 py-3">Transaction ID</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Method</th>
                <th className="px-6 py-3">Proof</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-ink-400">Loading payments...</td></tr>
              )}
              {!loading && filtered.map((p) => (
                <tr key={p._id} className="border-t border-ink-900/5">
                  <td className="px-6 py-4 font-semibold text-ink-900">{p.transactionId || "—"}</td>
                  <td className="px-6 py-4 text-ink-700">
                    {p.user?.name} <span className="text-ink-400">({p.user?.profileId})</span>
                  </td>
                  <td className="px-6 py-4 text-ink-600">PKR {(p.amount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-ink-600">{p.method}</td>
                  <td className="px-6 py-4">
                    {p.screenshot ? (
                      <button
                        onClick={() => setPreview(p.screenshot)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-600 hover:bg-blush-100"
                        title="View screenshot"
                      >
                        <ImageIcon size={14} />
                      </button>
                    ) : (
                      <span className="text-ink-300 text-xs">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusCls[p.status]}`}>
                      {statusLabel[p.status] || p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {p.status !== "approved" && (
                        <button
                          title="Approve"
                          disabled={busyId === p._id}
                          onClick={() => setPaymentStatus(p._id, "approved")}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-500/10 disabled:opacity-40"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                      )}
                      {p.status !== "rejected" && (
                        <button
                          title="Reject"
                          disabled={busyId === p._id}
                          onClick={() => setPaymentStatus(p._id, "rejected")}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-600 hover:bg-rose-500/10 disabled:opacity-40"
                        >
                          <XCircle size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-ink-400">No payments match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6" onClick={() => setPreview(null)}>
          <img src={preview} alt="Payment proof" className="max-w-full max-h-full rounded-xl shadow-2xl" />
        </div>
      )}
    </div>
  );
}
