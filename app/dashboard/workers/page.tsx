"use client";
import { useState, useMemo } from "react";
import styles from "../styles.module.css";
import Modal from "../components/Modal";
import { useSearchParams } from "next/navigation";
import { useDashboard } from "../context/DashboardContext";

export default function Workers() {
  const { workers, tags, assignTag, editWorker, toggleWorkerStatus } = useDashboard();
  const [filter, setFilter] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeWorkerId, setActiveWorkerId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const q = searchParams?.get("q") || "";

  // apply search param if present (on first load)
  useMemo(() => {
    if (q) setFilter(q);
  }, [q]);

  const filtered = workers.filter((w) => (w.name + w.id + w.tag).toLowerCase().includes(filter.toLowerCase()));

  const openAssign = (workerId: string) => {
    setActiveWorkerId(workerId);
    setAssignOpen(true);
  };

  const openEdit = (workerId: string) => {
    setActiveWorkerId(workerId);
    setEditOpen(true);
  };

  const handleAssign = (tagId: string) => {
    if (!activeWorkerId) return;
    assignTag(activeWorkerId, tagId);
    setAssignOpen(false);
  };

  const handleEditSave = (updated: { id: string; name: string; status: "Present" | "Absent" }) => {
    const w = workers.find((x) => x.id === updated.id);
    if (w) {
      editWorker({ ...w, name: updated.name, status: updated.status });
    }
    setEditOpen(false);
  };

  const availableTags = tags.filter((t) => t.status === "Active" && !t.assignedTo);

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Workers</h1>
          <p className={styles.small}>Manage workforce and assign RFID tags.</p>
        </div>
        <div>
          <input className={styles.search} placeholder="Search name, id, tag" value={filter} onChange={(e)=>setFilter(e.target.value)} />
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Tag</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(w => (
            <tr key={w.id}>
              <td>{w.id}</td>
              <td>{w.name}</td>
              <td>{w.tag || "—"}</td>
              <td>
                {w.status} <button className="btn secondary" onClick={() => toggleWorkerStatus(w.id)} style={{ marginLeft: 8 }}>Toggle</button>
              </td>
              <td className={styles.actions}>
                <button className="btn" onClick={() => openAssign(w.id)}>Assign Tag</button>
                <button className="btn secondary" onClick={() => openEdit(w.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={assignOpen} title="Assign Tag" onClose={() => setAssignOpen(false)}>
        <div>
          <p>Select a tag to assign:</p>
          {availableTags.length === 0 ? (
            <p className={styles.small}>No unassigned active tags available.</p>
          ) : (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {availableTags.map(t => (
                <button key={t.id} className="btn" onClick={() => handleAssign(t.id)}>{t.id}</button>
              ))}
            </div>
          )}
        </div>
      </Modal>

      <Modal open={editOpen} title="Edit Worker" onClose={() => setEditOpen(false)}>
        {activeWorkerId && (() => {
          const w = workers.find(x => x.id === activeWorkerId)!;
          let name = w.name;
          let status = w.status as "Present" | "Absent";
          return (
            <form onSubmit={(e) => { e.preventDefault(); handleEditSave({ id: w.id, name, status }); }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Name</label>
              <input defaultValue={w.name} onChange={(e) => (name = e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 12 }} />
              <label style={{ display: 'block', marginBottom: 8 }}>Status</label>
              <select defaultValue={w.status} onChange={(e) => (status = e.target.value as any)} style={{ padding: 8, marginBottom: 12 }}>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button className="btn secondary" type="button" onClick={() => setEditOpen(false)}>Cancel</button>
                <button className="btn" type="submit">Save</button>
              </div>
            </form>
          );
        })()}
      </Modal>
    </main>
  );
}