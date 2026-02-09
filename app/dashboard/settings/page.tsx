import React from "react";
import UserManagement from "./components/UserManagement";
import RFIDSettings from "./components/RFIDSettings";
import SystemSettings from "./components/SystemSettings";
import styles from "../styles.module.css";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <main className={styles.dashboard}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Settings</h1>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        <UserManagement />
        <div className={styles.grid + " cols-2"}>
          <RFIDSettings />
          <SystemSettings />
        </div>
      </div>
    </main>
  );
}
