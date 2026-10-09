"use client";

import { useEffect, useMemo, useState } from "react";

type GiftType = "amplop" | "transfer" | "kado";

interface GiftItem {
  _id: string;
  guestName: string;
  type: GiftType;
  amount: number;
  item: string;
  note: string;
  createdAt: string;
}

const TYPE_LABEL: Record<GiftType, string> = {
  amplop: "✉️ Amplop",
  transfer: "💳 Transfer",
  kado: "🎁 Kado",
};

const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

const EMPTY = { guestName: "", type: "amplop" as GiftType, amount: "", item: "", note: "" };

export default function GiftsAdminClient() {
  const [items, setItems] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/gifts")
      .then((r) => r.json())
      .then((j) => j.ok && setItems(j.data.items))
      .finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => {
    const sum = (t: GiftType) => items.filter((g) => g.type === t).reduce((s, g) => s + g.amount, 0);
    return {
      amplop: sum("amplop"),
      transfer: sum("transfer"),
      kado: items.filter((g) => g.type === "kado").length,
    };
  }, [items]);

  const filtered = items.filter((g) =>
    `${g.guestName} ${g.item} ${g.note}`.toLowerCase().includes(search.toLowerCase()),
  );

  const isKado = form.type === "kado";
  const amount = Number(form.amount.replace(/\D/g, "")) || 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (isKado ? !form.item.trim() : amount <= 0) {
      setError(isKado ? "Isi barang kado" : "Isi nominal");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: isKado ? 0 : amount }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error?.message ?? "Gagal menyimpan");
      setItems((prev) => [j.data, ...prev]);
      setForm({ ...EMPTY, type: form.type }); // keep type, pencatat biasanya input berurutan
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function remove(g: GiftItem) {
    if (!confirm(`Hapus catatan dari ${g.guestName}?`)) return;
    const res = await fetch(`/api/admin/gifts/${g._id}`, { method: "DELETE" });
    if ((await res.json()).ok) setItems((prev) => prev.filter((x) => x._id !== g._id));
  }

  const input =
    "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Amplop & Kado</h1>
        <p className="text-sm text-gray-500 mt-0.5">Catat amplop, transfer, dan kado dari tamu</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: "💰", label: "Total Uang", value: rupiah(summary.amplop + summary.transfer), color: "bg-rose-50 border-rose-100", text: "text-rose-700" },
          { icon: "✉️", label: "Amplop", value: rupiah(summary.amplop), color: "bg-amber-50 border-amber-100", text: "text-amber-700" },
          { icon: "💳", label: "Transfer", value: rupiah(summary.transfer), color: "bg-blue-50 border-blue-100", text: "text-blue-700" },
          { icon: "🎁", label: "Kado", value: `${summary.kado} barang`, color: "bg-green-50 border-green-100", text: "text-green-700" },
        ].map((c) => (
          <div key={c.label} className={`rounded-2xl border p-5 ${c.color}`}>
            <p className="text-sm text-gray-500">{c.icon} {c.label}</p>
            <p className={`text-xl font-bold mt-1 ${c.text}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Tambah Catatan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            className={input}
            placeholder="Nama tamu"
            value={form.guestName}
            onChange={(e) => setForm({ ...form, guestName: e.target.value })}
            required
            maxLength={120}
          />
          <select
            className={input}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as GiftType })}
          >
            {(Object.keys(TYPE_LABEL) as GiftType[]).map((t) => (
              <option key={t} value={t}>{TYPE_LABEL[t]}</option>
            ))}
          </select>
          {isKado ? (
            <input
              className={input}
              placeholder="Barang (mis. set piring)"
              value={form.item}
              onChange={(e) => setForm({ ...form, item: e.target.value })}
              maxLength={200}
            />
          ) : (
            <input
              className={input}
              placeholder="Nominal (Rp)"
              inputMode="numeric"
              value={amount ? amount.toLocaleString("id-ID") : ""}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          )}
          <input
            className={input}
            placeholder="Catatan (opsional)"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            maxLength={300}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-5 py-2 rounded-xl text-sm font-medium shadow disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </form>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-sm text-gray-500">{filtered.length} catatan</p>
          <input
            className={`${input} sm:max-w-xs`}
            placeholder="Cari nama / barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Jenis</th>
                <th className="px-4 py-3 font-medium">Nominal / Barang</th>
                <th className="px-4 py-3 font-medium">Catatan</th>
                <th className="px-4 py-3 font-medium">Waktu</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Memuat...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Belum ada catatan</td></tr>
              ) : (
                filtered.map((g) => (
                  <tr key={g._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{g.guestName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{TYPE_LABEL[g.type]}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{g.type === "kado" ? g.item : rupiah(g.amount)}</td>
                    <td className="px-4 py-3 text-gray-500">{g.note || "-"}</td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {new Date(g.createdAt).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => remove(g)} className="text-red-500 hover:text-red-700 text-xs">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
