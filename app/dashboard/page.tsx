"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import { useDashboard } from "./context/DashboardContext";

export default function Dashboard() {
  const router = useRouter();
  const { workers, tags } = useDashboard();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/");
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Admin Dashboard</h1>
          <p className={styles.small}>Worker attendance and RFID management</p>
        </div>
        <div className={styles.nav}>
          <Link href="/dashboard/workers" className="btn">Workers</Link>
          <Link href="/dashboard/tags" className="btn">Tags</Link>
          <Link href="/dashboard/reports" className="btn">Reports</Link>
          <button onClick={handleLogout} className="btn secondary">Logout</button>
        </div>
      </div>

      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <h3>Today's Attendance</h3>
          <p><strong>Present:</strong> {workers.filter(w => w.status === "Present").length} / {workers.length}</p>
          <p className={styles.small}>Real-time updates as workers scan their tags.</p>
        </div>

        <div className={styles.card}>
          <h3>Registered Tags</h3>
          <p><strong>Active:</strong> {tags.filter(t => t.status === "Active").length}</p>
          <p className={styles.small}>Active tags and reader status.</p>
        </div>

        <div className={styles.card}>
          <h3>Quick Actions</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/dashboard/workers" className="btn">Manage Workers</Link>
            <Link href="/dashboard/reports" className="btn">View Reports</Link>
          </div>
        </div>
      </div>

      <section>
        <h2>Recent Activity</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Worker</th>
              <th>Tag</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>08:12</td>
              <td>Jose Ramos</td>
              <td>TAG-034</td>
              <td>Check-in</td>
            </tr>
            <tr>
              <td>08:09</td>
              <td>Maria Cruz</td>
              <td>TAG-017</td>
              <td>Check-in</td>
            </tr>
            <tr>
              <td>07:58</td>
              <td>Samuel Dela</td>
              <td>TAG-002</td>
              <td>Check-in</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}
