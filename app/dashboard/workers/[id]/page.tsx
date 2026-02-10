import React from "react";
import styles from "../../styles.module.css";
import EditableProfile from "./components/EditableProfile";

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

      <EditableProfile worker={worker} />

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
