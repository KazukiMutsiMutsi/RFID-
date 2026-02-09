import React from "react";
import styles from "../../styles.module.css";

export const dynamic = "force-dynamic";

async function getWorker(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/workers/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load worker");
  return res.json();
}

async function getEvents(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/workers/${id}/events`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load events");
  return res.json();
}

export default async function WorkerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ worker }, { events }] = await Promise.all([getWorker(id), getEvents(id)]);

  return (
    <main className={styles.dashboard}>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>{worker.name}</h1>

      <section className={styles.card}>
        <div className={styles.cardHeader}><h2>Overview</h2></div>
        <div className={styles.cardBody}>
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {worker.photoUrl ? (
                <img 
                  src={worker.photoUrl} 
                  alt={worker.name}
                  style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: "50%", 
                    objectFit: "cover",
                    border: "3px solid #e5e7eb"
                  }}
                />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#e5e7eb", display: "grid", placeItems: "center", fontSize: 24, fontWeight: 700 }}>
                  {worker.name.split(" ").map((p: string) => p[0]).join("")}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 700 }}>{worker.name}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{worker.email}</div>
                <div className={styles.badge + " " + (worker.status === "active" ? styles.statusOnline : styles.statusOffline)} style={{ marginTop: 6 }}>{worker.status}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              <div className={styles.stat}><div className={styles.statLabel}>Role</div><div className={styles.statValue}>{worker.role}</div></div>
              <div className={styles.stat}><div className={styles.statLabel}>Department</div><div className={styles.statValue}>{worker.department}</div></div>
              <div className={styles.stat}><div className={styles.statLabel}>Tag</div><div className={styles.statValue}>{worker.tagId ?? "—"}</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}><h2>Recent Activity</h2></div>
        <div className={styles.cardBody}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Door</th>
                <th>Direction</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev: any) => (
                <tr key={ev.id} className={styles.tableRow}>
                  <td>{new Date(ev.time).toLocaleString()}</td>
                  <td>{ev.door}</td>
                  <td>{ev.direction}</td>
                  <td>
                    <span className={styles.badge + " " + (ev.status === "allowed" ? styles.statusAllowed : styles.statusDenied)}>
                      {ev.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
