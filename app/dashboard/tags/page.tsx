"use client";
import { useState } from "react";
import styles from "../styles.module.css";
import Modal from "../components/Modal";
import { useDashboard } from "../context/DashboardContext";

export default function Tags() {
  const { tags, registerTag, deactivateTag, assignTag, workers } = useDashboard();
  const [registerOpen, setRegisterOpen] = useState(false);
  const [newTag, setNewTag] = useState("");

  const handleRegister = () => {
    if (!newTag.trim()) return;
    registerTag(newTag.trim().toUpperCase());
    setNewTag("");
    setRegisterOpen(false);
  };

  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const openAssign = (tagId: string) => {
    setSelectedTag(tagId);
    setAssignOpen(true);
  };

  const handleAssignToWorker = (workerId: string) => {
    if (!selectedTag) return;
    assignTag(workerId, selectedTag);
    setAssignOpen(false);
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>RFID Tags</h1>
          <p className={styles.small}>Manage tags and their assignments.</p>
        </div>
        <div>
          <button className="btn" onClick={() => setRegisterOpen(true)}>Register Tag</button>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Tag ID</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tags.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.assignedTo || "—"}</td>
              <td>{t.status}</td>
              <td className={styles.actions}>
                <button className="btn secondary" onClick={() => deactivateTag(t.id)}>Deactivate</button>
                <button className="btn" onClick={() => openAssign(t.id)}>Assign</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={registerOpen} title="Register Tag" onClose={() => setRegisterOpen(false)}>
        <div>
          <p>Enter Tag ID</p>
          <input value={newTag} onChange={(e)=>setNewTag(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 12 }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button className="btn secondary" onClick={() => setRegisterOpen(false)}>Cancel</button>
            <button className="btn" onClick={handleRegister}>Register</button>
          </div>
        </div>
      </Modal>

      <Modal open={assignOpen} title={`Assign ${selectedTag}`} onClose={() => setAssignOpen(false)}>
        <div>
          <p>Select a worker to assign tag <strong>{selectedTag}</strong> to:</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {workers.map((w: any) => (
              <button key={w.id} className="btn" onClick={() => handleAssignToWorker(w.id)}>{w.name} ({w.id})</button>
            ))}
          </div>
        </div>
      </Modal>
    </main>
  );
}