"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2, XCircle, KeyRound, ShieldCheck, RotateCcw,
} from "lucide-react";
import { Input, Field } from "@/components/FormFields";
import Button from "@/components/Button";

const statusCls = {
  approved: "bg-green-500/10 text-green-600",
  pending: "bg-gold-500/10 text-gold-600",
  rejected: "bg-rose-500/10 text-rose-600",
};

const statusLabel = { approved: "Approved", pending: "Pending", rejected: "Denied" };

export default function AccessManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  // Direct-grant form — admin authorizes one member (by their profile ID) to
  // see another member's contact number + hidden photos, without needing a
  // request to already exist.
  const [viewerId, setViewerId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [note, setNote] = useState("");
  const [granting, setGranting] = useState(false);
  const [grantMsg, setGrantMsg] = useState(null); // { type: "success" | "error", text }

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/access-requests");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Requests load nahi ho sake.");
      setRequests(data.requests || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setReqStatus = async (id, status) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/access-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update nahi ho saka.");
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: data.request.status } : r)));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const submitGrant = async (e) => {
    e.preventDefault();
    setGranting(true);
    setGrantMsg(null);
    try {
      const res = await fetch("/api/admin/access-grants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viewerProfileId: viewerId, targetProfileId: targetId, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Access grant nahi ho saki.");
      const viewerName = data.grant?.user?.name || "Member";
      const targetName = data.grant?.targetProfile?.name || "Profile";
      const targetPid = data.grant?.targetProfile?.profileId || targetId;
      setGrantMsg({
        type: "success",
        text: `${viewerName} ko ab ${targetName} (${targetPid}) ka contact number aur hidden photos dikhengi.`,
      });
      setViewerId("");
      setTargetId("");
      setNote("");
      load();
    } catch (err) {
      setGrantMsg({ type: "error", text: err.message });
    } finally {
      setGranting(false);
    }
  };

  const pending = useMemo(() => requests.filter((r) => r.status === "pending"), [requests]);
  const active = useMemo(() => requests.filter((r) => r.status === "approved"), [requests]);
  const denied = useMemo(() => requests.filter((r) => r.status === "rejected"), [requests]);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900 mb-1 flex items-center gap-2">
        <KeyRound size={24} className="text-maroon-500" /> Contact & Photo Access Control
      </h1>
      <p className="text-ink-600 text-sm mb-8 max-w-2xl">
        Members' phone numbers and any photos they've hidden are private by default — nobody can see them
        without your approval. Approve a pending request below, or grant access directly using both
        members' profile IDs. One approval unlocks both the contact number and hidden photos together.
      </p>

      {error && (
        <p className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">{error}</p>
      )}

      {/* Grant Access Directly */}
      <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 mb-8">
        <h2 className="font-display text-lg font-semibold text-ink-900 mb-1 flex items-center gap-2">
          <ShieldCheck size={18} className="text-maroon-500" /> Grant Access Directly
        </h2>
        <p className="text-ink-500 text-xs mb-5">
          Example: member with profile ID <span className="font-semibold">MAT-1000</span> wants to see member{" "}
          <span className="font-semibold">MAT-2000</span>'s number and photos — enter both IDs below and grant.
        </p>

        <form onSubmit={submitGrant} className="grid sm:grid-cols-3 gap-4 items-start">
          <Field label="Viewer's Profile ID" hint="Who should be able to see">
            <Input
              placeholder="e.g. MAT-1000"
              value={viewerId}
              onChange={(e) => setViewerId(e.target.value)}
              required
            />
          </Field>
          <Field label="Target's Profile ID" hint="Whose number / photos to unlock">
            <Input
              placeholder="e.g. MAT-2000"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              required
            />
          </Field>
          <Field label="Note (optional)" hint="Internal reference only">
            <Input
              placeholder="e.g. Confirmed on call"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Field>
          <div className="sm:col-span-3 flex items-center gap-3">
            <Button type="submit" disabled={granting}>
              {granting ? "Granting..." : "Grant Access"}
            </Button>
            {grantMsg && (
              <p className={`text-sm ${grantMsg.type === "success" ? "text-green-600" : "text-rose-600"}`}>
                {grantMsg.text}
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Pending Requests */}
      <SectionHeader title="Pending Requests" desc="Members waiting for you to approve or deny." />
      <RequestsTable
        rows={pending}
        loading={loading}
        emptyText="No pending requests right now."
        renderActions={(r) => (
          <div className="flex items-center justify-end gap-2">
            <button
              title="Approve"
              disabled={busyId === r._id}
              onClick={() => setReqStatus(r._id, "approved")}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-500/10 disabled:opacity-40"
            >
              <CheckCircle2 size={14} />
            </button>
            <button
              title="Deny"
              disabled={busyId === r._id}
              onClick={() => setReqStatus(r._id, "rejected")}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-600 hover:bg-rose-500/10 disabled:opacity-40"
            >
              <XCircle size={14} />
            </button>
          </div>
        )}
      />

      {/* Active Grants */}
      <SectionHeader
        title="Active Grants"
        desc="These members can currently see the target's contact number and hidden photos."
      />
      <RequestsTable
        rows={active}
        loading={loading}
        emptyText="No active access grants yet."
        renderActions={(r) => (
          <button
            title="Revoke access"
            disabled={busyId === r._id}
            onClick={() => setReqStatus(r._id, "rejected")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-500/10 disabled:opacity-40"
          >
            <RotateCcw size={13} /> Revoke
          </button>
        )}
      />

      {/* Denied / Revoked */}
      <SectionHeader title="Denied / Revoked" desc="Past requests that were denied or grants that were revoked." />
      <RequestsTable
        rows={denied}
        loading={loading}
        emptyText="Nothing here yet."
        renderActions={(r) => (
          <button
            title="Approve"
            disabled={busyId === r._id}
            onClick={() => setReqStatus(r._id, "approved")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-green-600 hover:bg-green-500/10 disabled:opacity-40"
          >
            <CheckCircle2 size={13} /> Approve
          </button>
        )}
      />
    </div>
  );
}

function SectionHeader({ title, desc }) {
  return (
    <div className="mt-10 mb-3">
      <h2 className="font-display text-lg font-semibold text-ink-900">{title}</h2>
      {desc && <p className="text-ink-500 text-xs mt-0.5">{desc}</p>}
    </div>
  );
}

function RequestsTable({ rows, loading, emptyText, renderActions }) {
  return (
    <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-400 text-xs uppercase tracking-wide">
              <th className="px-6 py-3">Viewer (Requested By)</th>
              <th className="px-6 py-3">Target Profile</th>
              <th className="px-6 py-3">Reason / Note</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-ink-400">Loading...</td></tr>
            )}
            {!loading && rows.map((r) => (
              <tr key={r._id} className="border-t border-ink-900/5">
                <td className="px-6 py-4 text-ink-700">
                  {r.user?.name} <span className="text-ink-400">({r.user?.profileId})</span>
                </td>
                <td className="px-6 py-4 font-semibold text-ink-900">
                  {r.targetProfile?.name} <span className="text-ink-400 font-normal">({r.targetProfile?.profileId})</span>
                </td>
                <td className="px-6 py-4 text-ink-600">{r.reason || "—"}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusCls[r.status]}`}>
                    {statusLabel[r.status] || r.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">{renderActions(r)}</td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-ink-400">{emptyText}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
