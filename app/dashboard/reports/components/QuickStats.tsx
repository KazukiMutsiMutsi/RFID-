"use client";

import { useEffect, useState } from "react";
import styles from "../../styles.module.css";

type Stats = {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  attendanceRate: number;
  totalEvents: number;
  activeReaders: number;
  totalReaders: number;
};

export default function QuickStats() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    attendanceRate: 0,
    totalEvents: 0,
    activeReaders: 8,
    totalReaders: 8,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/reports/stats", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.card}><div className={styles.cardBody}>Loading statistics...</div></div>;
  }

  return (
    <div className={styles.grid + " cols-3"}>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Today's Attendance</div>
            <div className={styles.statValue} style={{ color: "#10b981" }}>
              {stats.attendanceRate.toFixed(1)}%
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
              Present: {stats.presentToday} | Absent: {stats.absentToday} | Late: {stats.lateToday}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Total Events Today</div>
            <div className={styles.statValue}>{stats.totalEvents.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
              RFID scans recorded
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Active Readers</div>
            <div className={styles.statValue}>
              {stats.activeReaders}/{stats.totalReaders}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
              {stats.totalReaders - stats.activeReaders} offline
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
