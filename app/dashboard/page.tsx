import React from "react";
import AttendanceSummary from "./components/AttendanceSummary";
import DoorStatusGrid from "./components/DoorStatusGrid";
import styles from "./styles.module.css";
import Link from "next/link";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function getBaseUrl() {
  try {
    const h = Object.fromEntries(await headers());
    const protocol = (h["x-forwarded-proto"] as string) || "http";
    const host = (h["x-forwarded-host"] as string) || (h["host"] as string) || "localhost:3000";
    return `${protocol}://${host}`;
  } catch {
    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  }
}

async function getCounts(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || await getBaseUrl();
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
      <div style={{ marginBottom: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, color: "#1f2937", letterSpacing: "-0.02em" }}>
          Dashboard Overview
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0 0" }}>
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <section className={styles.grid + " cols-3"}>
        <div className={styles.card} style={{ background: "linear-gradient(135deg, #8b3b3b 0%, #a04848 100%)", border: "none", color: "white" }}>
          <div className={styles.cardHeader} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", background: "transparent" }}>
            <h2 style={{ color: "white", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>👨‍🎓</span> Students
            </h2>
          </div>
          <div className={styles.cardBody}>
            <div style={{ padding: 16, background: "rgba(255, 255, 255, 0.1)", borderRadius: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.8)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Enrolled</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "white", marginTop: 4 }}>{studentsTotal}</div>
            </div>
            <Link className={styles.button} href="/dashboard/students" style={{ background: "white", color: "#8b3b3b", border: "none", width: "100%", textAlign: "center", fontWeight: 700 }}>
              View All Students →
            </Link>
          </div>
        </div>
        
        <div className={styles.card} style={{ background: "linear-gradient(135deg, #e6c57a 0%, #d4a960 100%)", border: "none", color: "white" }}>
          <div className={styles.cardHeader} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", background: "transparent" }}>
            <h2 style={{ color: "white", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>👷</span> Workers
            </h2>
          </div>
          <div className={styles.cardBody}>
            <div style={{ padding: 16, background: "rgba(255, 255, 255, 0.1)", borderRadius: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.8)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Staff</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "white", marginTop: 4 }}>{workersTotal}</div>
            </div>
            <Link className={styles.button} href="/dashboard/workers" style={{ background: "white", color: "#d4a960", border: "none", width: "100%", textAlign: "center", fontWeight: 700 }}>
              View All Workers →
            </Link>
          </div>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>📊</span> Attendance
            </h2>
          </div>
          <div className={styles.cardBody}>
            <AttendanceSummary />
          </div>
        </div>
      </section>

      <DoorStatusGrid />
    </main>
  );
}
