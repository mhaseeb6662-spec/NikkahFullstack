"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, CheckCircle2, Ban, Clock, Eye, Plus, Pencil, Trash2, X, Image as ImageIcon, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Input, Select, Field } from "@/components/FormFields";
import Button from "@/components/Button";

const statusCls = {
  active: "bg-green-500/10 text-green-600",
  pending: "bg-gold-500/10 text-gold-600",
  suspended: "bg-rose-500/10 text-rose-600",
};

const statusLabel = { active: "Active", pending: "Pending", suspended: "Suspended" };

const emptyForm = { name: "", email: "", phone: "", password: "", status: "active", activateProfile: false };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [busyId, setBusyId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Users load nahi ho sake.");
      setUsers(data.users || []);
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
    return users.filter((u) => {
      const q = query.trim().toLowerCase();
      const matchesQ =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.profileId?.toLowerCase().includes(q);
      const matchesStatus = status === "all" || u.status === status;
      return matchesQ && matchesStatus;
    });
  }, [users, query, status]);

  const setUserStatus = async (id, newStatus, extra = {}) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update nahi ho saka.");
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, ...data.user } : u)));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  // Approving a member should always fully unlock the site for them — mark
  // both the account status AND the payment as done in one go, so the
  // "pending verification" screen on their side actually clears.
  const approveUser = (id) => setUserStatus(id, "active", { paymentStatus: "paid" });

  const createUser = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "User create nahi ho saka.");
      setUsers((prev) => [data.user, ...prev]);
      setCreateForm(emptyForm);
      setShowCreate(false);
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (u) => {
    setEditUser(u);
    setEditForm({ name: u.name || "", email: u.email || "", phone: u.phone || "", status: u.status, paymentStatus: u.paymentStatus });
    setEditError("");
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setEditError("");
    try {
      const res = await fetch(`/api/admin/users/${editUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update nahi ho saka.");
      setUsers((prev) => prev.map((u) => (u._id === editUser._id ? data.user : u)));
      setEditUser(null);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (u) => {
    if (!confirm(`${u.name} ka account aur profile permanently delete karna hai? Yeh action wapis nahi ho sakta.`)) return;
    setBusyId(u._id);
    try {
      const res = await fetch(`/api/admin/users/${u._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete nahi ho saka.");
      setUsers((prev) => prev.filter((x) => x._id !== u._id));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-1 flex-wrap">
        <h1 className="font-display text-3xl font-semibold text-ink-900">User Management</h1>
        <Button size="sm" onClick={() => setShowCreate((s) => !s)}>
          {showCreate ? <X size={16} /> : <Plus size={16} />} {showCreate ? "Cancel" : "Create User"}
        </Button>
      </div>
      <p className="text-ink-600 text-sm mb-6">
        Approve, activate, or suspend registered members. Every action here updates the live database.
      </p>

      {showCreate && (
        <form onSubmit={createUser} className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 mb-8">
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-4">Create User Manually</h2>
          <p className="text-xs text-ink-500 mb-4">
            Use this after receiving payment offline (bank transfer, cash, in person) to create and activate a member's
            account directly.
          </p>
          <div className="grid sm:grid-cols-2 gap-x-4">
            <Field label="Full Name">
              <Input required value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
            </Field>
            <Field label="Email">
              <Input required type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} />
            </Field>
            <Field label="Phone">
              <Input value={createForm.phone} onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })} />
            </Field>
            <Field label="Temporary Password">
              <Input required type="text" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} />
            </Field>
            <Field label="Account Status">
              <Select value={createForm.status} onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </Select>
            </Field>
            <label className="flex items-center gap-2 mt-7 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={createForm.activateProfile}
                onChange={(e) => setCreateForm({ ...createForm, activateProfile: e.target.checked })}
              />
              Mark payment received &amp; create an active profile
            </label>
          </div>
          {createError && <p className="text-sm text-rose-600 mb-3">{createError}</p>}
          <Button type="submit" disabled={creating}>{creating ? "Creating..." : "Create User"}</Button>
        </form>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <Input className="pl-10" placeholder="Search by name, email or profile ID..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Select className="sm:w-48" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
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
                <th className="px-6 py-3">Profile ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-ink-400">Loading users...</td></tr>
              )}
              {!loading && filtered.map((u) => (
                <tr key={u._id} className="border-t border-ink-900/5">
                  <td className="px-6 py-4 font-semibold text-ink-900">{u.profileId || "—"}</td>
                  <td className="px-6 py-4 text-ink-700">{u.name}</td>
                  <td className="px-6 py-4 text-ink-600">{u.email}</td>
                  <td className="px-6 py-4 text-ink-600">
                    {u.phone ? (
                      <div className="flex items-center gap-2.5">
                        <a href={`tel:${u.phone}`} className="font-semibold text-maroon-600 flex items-center gap-1 hover:underline">
                          <Phone size={12} /> {u.phone}
                        </a>
                        <a
                          href={`https://wa.me/${u.phone.replace(/[^\d]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Contact on WhatsApp"
                          className="text-green-600 hover:bg-green-500/10 w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                        >
                          <MessageCircle size={13} />
                        </a>
                      </div>
                    ) : (
                      <span className="text-ink-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-ink-600">
                    <p className="capitalize">{u.paymentStatus}</p>
                    {u.latestPayment && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-ink-400">
                          {u.latestPayment.transactionId || "No transaction ID"}
                        </span>
                        {u.latestPayment.screenshot && (
                          <button
                            type="button"
                            title="View bank transaction screenshot"
                            onClick={() => setPreview(u.latestPayment.screenshot)}
                            className="w-6 h-6 rounded-md flex items-center justify-center text-ink-600 hover:bg-blush-100 shrink-0"
                          >
                            <ImageIcon size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusCls[u.status]}`}>
                      {statusLabel[u.status] || u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {u.profileId && (
                        <Link
                          href={`/profile/${u.profileId}`}
                          target="_blank"
                          title="View Public Profile"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-600 hover:bg-blush-100"
                        >
                          <Eye size={14} />
                        </Link>
                      )}
                      <IconBtn title="Edit User" onClick={() => openEdit(u)}>
                        <Pencil size={14} />
                      </IconBtn>
                      {u.status !== "active" && (
                        <IconBtn title="Approve / Activate" tone="green" disabled={busyId === u._id} onClick={() => approveUser(u._id)}>
                          <CheckCircle2 size={14} />
                        </IconBtn>
                      )}
                      {u.status !== "pending" && (
                        <IconBtn title="Mark Pending" tone="gold" disabled={busyId === u._id} onClick={() => setUserStatus(u._id, "pending")}>
                          <Clock size={14} />
                        </IconBtn>
                      )}
                      {u.status !== "suspended" && (
                        <IconBtn title="Suspend" tone="rose" disabled={busyId === u._id} onClick={() => setUserStatus(u._id, "suspended")}>
                          <Ban size={14} />
                        </IconBtn>
                      )}
                      {u.role !== "admin" && (
                        <IconBtn title="Delete User" tone="rose" disabled={busyId === u._id} onClick={() => deleteUser(u)}>
                          <Trash2 size={14} />
                        </IconBtn>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-ink-400">No users match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditUser(null)}>
          <form
            onSubmit={saveEdit}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-ink-900">Edit User</h2>
              <button type="button" onClick={() => setEditUser(null)} className="text-ink-400 hover:text-ink-700">
                <X size={18} />
              </button>
            </div>
            <Field label="Full Name">
              <Input required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </Field>
            <Field label="Email">
              <Input required type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            </Field>
            <Field label="Phone">
              <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Account Status">
                <Select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </Select>
              </Field>
              <Field label="Payment Status">
                <Select value={editForm.paymentStatus} onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value })}>
                  <option value="unpaid">Unpaid</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </Select>
              </Field>
            </div>
            {editError && <p className="text-sm text-rose-600 mb-3">{editError}</p>}
            <Button type="submit" disabled={saving} className="w-full justify-center">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6" onClick={() => setPreview(null)}>
          <img src={preview} alt="Payment proof" className="max-w-full max-h-full rounded-xl shadow-2xl" />
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, title, tone = "default", onClick, disabled }) {
  const tones = {
    default: "text-ink-600 hover:bg-blush-100",
    green: "text-green-600 hover:bg-green-500/10",
    rose: "text-rose-600 hover:bg-rose-500/10",
    gold: "text-gold-600 hover:bg-gold-500/10",
  };
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 ${tones[tone]}`}
    >
      {children}
    </button>
  );
}
