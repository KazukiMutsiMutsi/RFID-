import React from "react";
import AttendanceSummary from "./components/AttendanceSummary";
import DoorStatusGrid from "./components/DoorStatusGrid";
import HeroClock from "./components/HeroClock";
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
  const [{ total: studentsTotal }] = await Promise.all([
    getCounts("/api/students"),
  ]);

  return (
    <main className={styles.dashboard}>

      {/* ── Hero Banner (client component — live clock) ── */}
      <HeroClock />

      {/* ── Quick Stats Row ── */}
      <div className={styles.statsRow}>
        <div className={`${styles.statCard} ${styles.statRed}`}>
          <div className={styles.statIcon}>👨‍🎓</div>
          <div className={styles.statInfo}>
            <div className={styles.statNum}>{studentsTotal}</div>
            <div className={styles.statLbl}>Total Students</div>
          </div>
          <Link href="/dashboard/students" className={styles.statLink}>View →</Link>
        </div>

        <div className={`${styles.statCard} ${styles.statGold}`}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statInfo}>
            <div className={styles.statNum}>—</div>
            <div className={styles.statLbl}>Present Today</div>
          </div>
          <Link href="/dashboard/attendance" className={styles.statLink}>View →</Link>
        </div>

        <div className={`${styles.statCard} ${styles.statGreen}`}>
          <div className={styles.statIcon}>🏷️</div>
          <div className={styles.statInfo}>
            <div className={styles.statNum}>—</div>
            <div className={styles.statLbl}>Active Tags</div>
          </div>
          <Link href="/dashboard/tags" className={styles.statLink}>View →</Link>
        </div>

        <div className={`${styles.statCard} ${styles.statBlue}`}>
          <div className={styles.statIcon}>📡</div>
          <div className={styles.statInfo}>
            <div className={styles.statNum}>—</div>
            <div className={styles.statLbl}>RFID Readers</div>
          </div>
          <Link href="/dashboard/settings" className={styles.statLink}>View →</Link>
        </div>
      </div>

      {/* ── Quick Nav Cards ── */}
      <div className={styles.quickNav}>
        <Link href="/dashboard/attendance" className={styles.quickCard}>
          <div className={styles.quickCardIcon} style={{ background: "linear-gradient(135deg,#8b3b3b,#c0504d)" }}>📋</div>
          <div className={styles.quickCardLabel}>Attendance</div>
          <div className={styles.quickCardSub}>Track & monitor</div>
        </Link>
        <Link href="/dashboard/students" className={styles.quickCard}>
          <div className={styles.quickCardIcon} style={{ background: "linear-gradient(135deg,#1e40af,#3b82f6)" }}>👨‍🎓</div>
          <div className={styles.quickCardLabel}>Students</div>
          <div className={styles.quickCardSub}>Manage records</div>
        </Link>
        <Link href="/dashboard/tags" className={styles.quickCard}>
          <div className={styles.quickCardIcon} style={{ background: "linear-gradient(135deg,#065f46,#10b981)" }}>🏷️</div>
          <div className={styles.quickCardLabel}>RFID Tags</div>
          <div className={styles.quickCardSub}>Assign & track</div>
        </Link>
        <Link href="/dashboard/reports" className={styles.quickCard}>
          <div className={styles.quickCardIcon} style={{ background: "linear-gradient(135deg,#92400e,#f59e0b)" }}>📊</div>
          <div className={styles.quickCardLabel}>Reports</div>
          <div className={styles.quickCardSub}>Generate & export</div>
        </Link>
        <Link href="/dashboard/settings" className={styles.quickCard}>
          <div className={styles.quickCardIcon} style={{ background: "linear-gradient(135deg,#4b5563,#9ca3af)" }}>⚙️</div>
          <div className={styles.quickCardLabel}>Settings</div>
          <div className={styles.quickCardSub}>Configure system</div>
        </Link>
      </div>

      {/* ── Attendance Summary + Readers ── */}
      <div className={styles.bottomGrid}>
        <AttendanceSummary />
        <DoorStatusGrid />
      </div>

    </main>
  );
}
