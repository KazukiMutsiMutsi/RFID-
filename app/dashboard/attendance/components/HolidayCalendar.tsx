"use client";

import { useState, useEffect } from "react";
import styles from "../../styles.module.css";

type Holiday = {
  id: string;
  date: string;
  name: string;
  type: "regular" | "special" | "school";
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const TYPE_META = {
  regular: { label: "Regular Holiday", bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
  special: { label: "Special Holiday", bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  school:  { label: "School Holiday",  bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
};

function todayStr() { return new Date().toISOString().split("T")[0]; }
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDay(y: number, m: number)    { return new Date(y, m, 1).getDay(); }

export default function HolidayCalendar() {
  const now = new Date();
  const [year,          setYear]          = useState(now.getFullYear());
  const [month,         setMonth]         = useState(now.getMonth());
  const [holidays,      setHolidays]      = useState<Holiday[]>([]);
  const [loadingHols,   setLoadingHols]   = useState(true);
  const [selected,      setSelected]      = useState<string | null>(null);
  const [modal,         setModal]         = useState<"add" | "edit" | null>(null);
  const [editTarget,    setEditTarget]    = useState<Holiday | null>(null);
  const [form,          setForm]          = useState({ date: "", name: "", type: "school" as Holiday["type"] });
  const [saving,        setSaving]        = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/holidays", { cache: "no-store" })
      .then(r => r.json())
      .then(d => setHolidays(d.holidays || []))
      .catch(() => {})
      .finally(() => setLoadingHols(false));
  }, []);

  const holidayMap = new Map<string, Holiday[]>();
  holidays.forEach(h => {
    if (!holidayMap.has(h.date)) holidayMap.set(h.date, []);
    holidayMap.get(h.date)!.push(h);
  });

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const openAdd = (dateStr: string) => { setForm({ date: dateStr, name: "", type: "school" }); setEditTarget(null); setModal("add"); };
  const openEdit = (h: Holiday)     => { setForm({ date: h.date, name: h.name, type: h.type }); setEditTarget(h); setModal("edit"); };

  const saveHoliday = async () => {
    if (!form.name.trim() || !form.date) return;
    setSaving(true);
    try {
      if (modal === "edit" && editTarget) {
        const res = await fetch(`/api/holidays/${editTarget.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        if (res.ok) { const { holiday } = await res.json(); setHolidays(p => p.map(h => h.id === editTarget.id ? holiday : h)); }
      } else {
        const res = await fetch("/api/holidays", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        if (res.ok) { const { holiday } = await res.json(); setHolidays(p => [...p, holiday]); }
      }
    } finally { setSaving(false); setModal(null); }
  };

  const deleteHoliday = async (id: string) => {
    await fetch(`/api/holidays/${id}`, { method: "DELETE" });
    setHolidays(p => p.filter(h => h.id !== id));
    setDeleteConfirm(null);
  };

  const totalDays     = daysInMonth(year, month);
  const startDay      = firstDay(year, month);
  const today         = todayStr();
  const monthHolidays = holidays
    .filter(h => h.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className={styles.card}>

      {/* ── Header ── */}
      <div className={styles.cardHeader} style={{ flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>📅</span>
          <div>
            <h2 style={{ margin: 0 }}>Holiday Calendar</h2>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Philippine holidays + custom school events</div>
          </div>
        </div>
        <button
          className={styles.button}
          onClick={() => openAdd(`${year}-${String(month + 1).padStart(2, "0")}-01`)}
          style={{ background: "#8b3b3b", color: "white", fontWeight: 700 }}
        >
          + Add Holiday
        </button>
      </div>

      {/* ── Body ── */}
      <div className={styles.cardBody}>
        {loadingHols ? (
          <div style={{ color: "#9ca3af", fontSize: 14, padding: "20px 0" }}>Loading holidays…</div>
        ) : (
          <>
            {/* Legend */}
            <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
              {(Object.entries(TYPE_META) as [Holiday["type"], typeof TYPE_META.regular][]).map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: v.dot }} />
                  <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{v.label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>

              {/* ── Calendar Grid ── */}
              <div>
                {/* Month nav */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <button onClick={prevMonth} className={styles.button} style={{ padding: "6px 14px" }}>‹</button>
                  <div style={{ fontWeight: 800, fontSize: 18, color: "#1f2937" }}>{MONTHS[month]} {year}</div>
                  <button onClick={nextMonth} className={styles.button} style={{ padding: "6px 14px" }}>›</button>
                </div>

                {/* Day headers */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
                  {DAYS.map(d => (
                    <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#9ca3af", padding: "4px 0", textTransform: "uppercase" }}>
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
                  {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ minHeight: 64 }} />
                  ))}
                  {Array.from({ length: totalDays }).map((_, i) => {
                    const day      = i + 1;
                    const dateStr  = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const dayHols  = holidayMap.get(dateStr) || [];
                    const isToday  = dateStr === today;
                    const isSun    = new Date(dateStr).getDay() === 0;
                    const isSat    = new Date(dateStr).getDay() === 6;
                    const isSel    = selected === dateStr;
                    return (
                      <div
                        key={day}
                        onClick={() => setSelected(isSel ? null : dateStr)}
                        style={{
                          minHeight: 64, borderRadius: 10, padding: "6px 7px", cursor: "pointer",
                          border: isToday ? "2px solid #8b3b3b" : isSel ? "2px solid #3b82f6" : "1px solid #f3f4f6",
                          background: isToday ? "#fff5f5" : isSel ? "#eff6ff" : dayHols.length > 0 ? "#fffbeb" : "#fafafa",
                          transition: "all 0.15s ease", position: "relative",
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: isToday ? 900 : 600, color: isToday ? "#8b3b3b" : isSun ? "#ef4444" : isSat ? "#3b82f6" : "#374151", marginBottom: 3 }}>
                          {day}
                          {isToday && <span style={{ fontSize: 9, marginLeft: 3, color: "#8b3b3b", fontWeight: 700 }}>TODAY</span>}
                        </div>
                        {dayHols.slice(0, 2).map(h => (
                          <div key={h.id} style={{ fontSize: 9, fontWeight: 700, color: TYPE_META[h.type].text, background: TYPE_META[h.type].bg, borderRadius: 4, padding: "1px 4px", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {h.name}
                          </div>
                        ))}
                        {dayHols.length > 2 && <div style={{ fontSize: 9, color: "#9ca3af" }}>+{dayHols.length - 2} more</div>}
                      </div>
                    );
                  })}
                </div>

                {/* Selected date banner */}
                {selected && (
                  <div style={{ marginTop: 12, padding: "10px 14px", background: "#eff6ff", borderRadius: 10, border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ fontSize: 13, color: "#1e40af", fontWeight: 600 }}>
                      📌 {new Date(selected + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </span>
                    <button className={styles.button} onClick={() => openAdd(selected)} style={{ background: "#1e40af", color: "white", fontSize: 12, padding: "5px 12px" }}>
                      + Add Holiday Here
                    </button>
                  </div>
                )}
              </div>

              {/* ── This Month's Holiday List ── */}
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#1f2937", marginBottom: 12 }}>
                  {MONTHS[month]} {year} — Holidays ({monthHolidays.length})
                </div>
                {monthHolidays.length === 0 ? (
                  <div style={{ padding: "24px 0", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No holidays this month.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {monthHolidays.map(h => {
                      const meta = TYPE_META[h.type];
                      const d    = new Date(h.date + "T00:00:00");
                      return (
                        <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: meta.bg, borderRadius: 12, border: `1px solid ${meta.dot}30` }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: meta.dot, flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: meta.text }}>{h.name}</div>
                            <div style={{ fontSize: 12, color: meta.text, opacity: 0.7, marginTop: 2 }}>
                              {d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} · {meta.label}
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                            <button onClick={() => openEdit(h)} style={{ background: "white", border: `1px solid ${meta.dot}60`, borderRadius: 8, padding: "4px 10px", fontSize: 12, cursor: "pointer", fontWeight: 600, color: meta.text }}>
                              ✏️ Edit
                            </button>
                            <button onClick={() => setDeleteConfirm(h.id)} style={{ background: "white", border: "1px solid #fca5a5", borderRadius: 8, padding: "4px 10px", fontSize: 12, cursor: "pointer", fontWeight: 600, color: "#dc2626" }}>
                              🗑️
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {(modal === "add" || modal === "edit") && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={() => setModal(null)}>
          <div style={{ background: "white", borderRadius: 16, maxWidth: 440, width: "100%", padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: 18, fontWeight: 800 }}>
              {modal === "edit" ? "✏️ Edit Holiday" : "➕ Add Holiday"}
            </h3>
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 13 }}>Date</label>
                <input type="date" className={styles.input} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 13 }}>Holiday Name</label>
                <input className={styles.input} placeholder="e.g. Foundation Day" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 13 }}>Type</label>
                <select className={styles.select} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Holiday["type"] }))} style={{ width: "100%" }}>
                  <option value="regular">🔴 Regular Holiday</option>
                  <option value="special">🟡 Special Holiday</option>
                  <option value="school">🔵 School Holiday</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button className={styles.button} onClick={() => setModal(null)} style={{ flex: 1 }} disabled={saving}>Cancel</button>
              <button
                className={styles.button}
                onClick={saveHoliday}
                disabled={!form.name.trim() || !form.date || saving}
                style={{ flex: 1, background: "#8b3b3b", color: "white", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {saving
                  ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Saving…</>
                  : modal === "edit" ? "Save Changes" : "Add Holiday"
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={() => setDeleteConfirm(null)}>
          <div style={{ background: "white", borderRadius: 16, maxWidth: 380, width: "100%", padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", textAlign: "center" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 800 }}>Remove Holiday?</h3>
            <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 24px 0" }}>This will permanently remove the holiday from the calendar.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className={styles.button} onClick={() => setDeleteConfirm(null)} style={{ flex: 1 }}>Cancel</button>
              <button className={styles.button} onClick={() => deleteHoliday(deleteConfirm)} style={{ flex: 1, background: "#dc2626", color: "white", fontWeight: 700, border: "none" }}>
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
