"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles.module.css";

type AttendanceBucket = {
  label: string; // e.g., Grade 7
  present: number;
  absent: number;
  late: number;
};

export default function AttendanceSummary() {
  const [data, setData] = useState<AttendanceBucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard/attendance", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load attendance");
        const json = await res.json();
        if (mounted) setData(json.buckets || []);
      } catch (e: any) {
        if (mounted) setError(e.message || "Error");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();

    const id = setInterval(fetchData, 30_000); // refresh every 30s
    return () => { mounted = false; clearInterval(id); };
  }, []);

  if (loading) return <section aria-busy>Loading attendance...</section>;
  if (error) return <section role="alert">Attendance error: {error}</section>;

  return (
    <section aria-label="Attendance summary" className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>Today’s Attendance</h2>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.grid} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {data.map((b) => (
            <div key={b.label} className={styles.card}>
              <div className={styles.cardBody}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{b.label}</div>
                <div style={{ display: "flex", gap: 16 }}>
                  <Stat label="Present" value={b.present} color="#10b981" />
                  <Stat label="Late" value={b.late} color="#f59e0b" />
                  <Stat label="Absent" value={b.absent} color="#ef4444" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}
