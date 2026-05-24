import React from "react";
import LocationHeatmap from "./components/LocationHeatmap";
import QuickSearch from "./components/QuickSearch";
import HolidayCalendar from "./components/HolidayCalendar";
import styles from "../styles.module.css";

export const dynamic = "force-dynamic";

export default function AttendancePage() {
  return (
    <main className={styles.dashboard}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Attendance & Location Tracking</h1>
      </div>

      <div className={styles.grid + " cols-2"}>
        <LocationHeatmap />
        <div style={{ display: "grid", gap: 16 }}>
          <QuickSearch />
        </div>
      </div>

      <HolidayCalendar />
    </main>
  );
}
