import React from "react";
import WorkersTable from "./components/WorkersTable";
import styles from "../styles.module.css";

export const dynamic = "force-dynamic";

export default function WorkersIndexPage() {
  return (
    <main className={styles.dashboard}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Workers</h1>
      <WorkersTable />
    </main>
  );
}
