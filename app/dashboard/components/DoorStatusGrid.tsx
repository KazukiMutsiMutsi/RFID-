"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles.module.css";

type Door = {
  id: string;
  name: string;
  status: "online" | "offline";
  lastHeartbeat: string; // ISO date
};

export default function DoorStatusGrid() {
  const [doors, setDoors] = useState<Door[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchDoors = async () => {
      try {
        const res = await fetch("/api/dashboard/doors", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load doors");
        const json = await res.json();
        if (mounted) setDoors(json.doors || []);
      } catch (e: any) {
        if (mounted) setError(e.message || "Error");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchDoors();

    const id = setInterval(fetchDoors, 20_000); // refresh every 20s
    return () => { mounted = false; clearInterval(id); };
  }, []);

  if (loading) return <section aria-busy>Loading doors...</section>;
  if (error) return <section role="alert">Door status error: {error}</section>;

  return (
    <section aria-label="Door status" className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>Readers</h2>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.grid} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {doors.map((d) => (
            <div key={d.id} className={styles.card}>
              <div className={styles.cardBody}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontWeight: 700 }}>{d.name}</div>
                  <span className={styles.badge + " " + (d.status === "online" ? styles.statusOnline : styles.statusOffline)}>
                    {d.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>Last heartbeat: {new Date(d.lastHeartbeat).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
