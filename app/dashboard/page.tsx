import React from "react";
import AttendanceSummary from "./components/AttendanceSummary";
import DoorStatusGrid from "./components/DoorStatusGrid";
import styles from "./styles.module.css";
import Link from "next/link";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

function getBaseUrl() {
  try {
    const h = Object.fromEntries(headers());
    const protocol = (h["x-forwarded-proto"] as string) || "http";
    const host = (h["x-forwarded-host"] as string) || (h["host"] as string) || "localhost:3000";
    return `${protocol}://${host}`;
  } catch {
    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  }
}

async function getCounts(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || getBaseUrl();
  const res = await fetch(`${base}${path}`, { cache: "no-store" });
  const json = await res.json();
  return { total: json.total ?? (json.data?.length ?? 0) };
}

export default async function DashboardPage() {
  // In real app fetch from separate count endpoints; here we call list endpoints and read total
  const [{ total: studentsTotal }, { total: workersTotal }] = await Promise.all([
    getCounts("/api/students"),
    getCounts("/api/workers"),
  ]);

  return (
    <main className={styles.dashboard}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Overview</h1>

      <section className={styles.grid + " cols-3"}>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h2>Students</h2></div>
          <div className={styles.cardBody}>
            <div className={styles.stat}><div className={styles.statLabel}>Total</div><div className={styles.statValue}>{studentsTotal}</div></div>
            <div style={{ marginTop: 12 }}>
              <Link className={styles.button} href="/dashboard/students">View Students</Link>
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h2>Workers</h2></div>
          <div className={styles.cardBody}>
            <div className={styles.stat}><div className={styles.statLabel}>Total</div><div className={styles.statValue}>{workersTotal}</div></div>
            <div style={{ marginTop: 12 }}>
              <Link className={styles.button} href="/dashboard/workers">View Workers</Link>
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h2>Attendance</h2></div>
          <div className={styles.cardBody}>
            <AttendanceSummary />
          </div>
        </div>
      </section>

      <DoorStatusGrid />

      {/* For brevity, reuse attendance/events elsewhere if needed */}
    </main>
  );
}
