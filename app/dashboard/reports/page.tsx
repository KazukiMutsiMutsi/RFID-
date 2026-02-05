"use client";
import { useState } from "react";
import styles from "../styles.module.css";
import { useDashboard } from "../context/DashboardContext";

const MOCK = [
  { date: "2026-02-03", present: 24, total: 28 },
  { date: "2026-02-02", present: 27, total: 28 },
  { date: "2026-02-01", present: 26, total: 28 },
];

export default function Reports() {
  const [period, setPeriod] = useState("7d");
  const { workers } = useDashboard();

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Attendance Reports</h1>
          <p className={styles.small}>Generate and export attendance summaries.</p>
        </div>
        <div>
          <select value={period} onChange={(e)=>setPeriod(e.target.value)} className={styles.search}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="custom">Custom range</option>
          </select>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Present</th>
            <th>Total</th>
            <th>Attendance %</th>
          </tr>
        </thead>
        <tbody>
          {MOCK.map(r => (
            <tr key={r.date}>
              <td>{r.date}</td>
              <td>{r.present}</td>
              <td>{r.total}</td>
              <td>{Math.round((r.present / r.total) * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 18 }}>
        <button
          className="btn"
          onClick={() => {
            const rows = [["ID","Name","Tag","Status"], ...workers.map(w => [w.id, w.name, w.tag || "", w.status])];
            const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `workers-${new Date().toISOString().slice(0,10)}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          }}
        >
          Download CSV
        </button>

        <button className="btn secondary" style={{ marginLeft: 8 }} onClick={() => window.print()}>Print</button>
      </div>
    </main>
  );
}