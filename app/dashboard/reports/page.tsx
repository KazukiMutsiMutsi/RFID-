import React from "react";
import ReportGenerator from "./components/ReportGenerator";
import ReportHistory from "./components/ReportHistory";
import QuickStats from "./components/QuickStats";
import styles from "../styles.module.css";

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  return (
    <main className={styles.dashboard}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Reports & Analytics</h1>
      </div>

      <QuickStats />
      
      <div className={styles.grid + " cols-2"}>
        <ReportGenerator />
        <ReportHistory />
      </div>
    </main>
  );
}
