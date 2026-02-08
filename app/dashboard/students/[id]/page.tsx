import React from "react";
import styles from "../../styles.module.css";

export const dynamic = "force-dynamic";

async function getStudent(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/students/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load student");
  return res.json();
}

async function getEvents(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/students/${id}/events`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load events");
  return res.json();
}

export default async function StudentProfilePage({ params }: { params: { id: string } }) {
  const [{ student }, { events }] = await Promise.all([getStudent(params.id), getEvents(params.id)]);

  return (
    <main className={styles.dashboard}>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>{student.name}</h1>

      <section className={styles.card}>
        <div className={styles.cardHeader}><h2>Overview</h2></div>
        <div className={styles.cardBody}>
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#e5e7eb", display: "grid", placeItems: "center", fontSize: 20 }}>
                {student.name.split(" ").map((p: string) => p[0]).join("")}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{student.name}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{student.email}</div>
                <div className={styles.badge + " " + (student.status === "active" ? styles.statusOnline : styles.statusOffline)} style={{ marginTop: 6 }}>{student.status}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              <div className={styles.stat}><div className={styles.statLabel}>Grade</div><div className={styles.statValue}>{student.grade}</div></div>
              <div className={styles.stat}><div className={styles.statLabel}>Section</div><div className={styles.statValue}>{student.section}</div></div>
              <div className={styles.stat}><div className={styles.statLabel}>Tag</div><div className={styles.statValue}>{student.tagId ?? "—"}</div></div>
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
