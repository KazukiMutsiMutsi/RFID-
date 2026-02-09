"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "../../styles.module.css";

type Worker = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "disabled";
  tagId: string | null;
  lastSeen: string | null;
  photoUrl?: string;
};

type ResponseList = {
  data: Worker[];
  page: number;
  pageSize: number;
  total: number;
};

export default function WorkersTable() {
  const [rows, setRows] = useState<Worker[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Worker | null>(null);
  const [signature, setSignature] = useState("");

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  useEffect(() => {
    let mounted = true;
    const fetchWorkers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
        if (search) params.set("search", search);
        if (role) params.set("role", role);
        if (status) params.set("status", status);

        const res = await fetch(`/api/workers?${params.toString()}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load workers");
        const json: ResponseList = await res.json();
        if (mounted) {
          setRows(json.data);
          setTotal(json.total);
        }
      } catch (e: any) {
        if (mounted) setError(e.message || "Error");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchWorkers();
  }, [page, pageSize, search, role, status]);

  const handleView = (worker: Worker) => {
    setSelectedWorker(worker);
    setEditForm(worker);
    setIsEditing(false);
    setSignature("");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editForm) {
      setRows(rows.map(w => w.id === editForm.id ? editForm : w));
      setSelectedWorker(editForm);
      setIsEditing(false);
      alert("Worker information updated successfully!");
    }
  };

  const handleClose = () => {
    setSelectedWorker(null);
    setIsEditing(false);
    setEditForm(null);
    setSignature("");
  };

  return (
    <>
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Workers</h2>
          <div className={styles.controls}>
            <input className={styles.input} placeholder="Search name/email/tag" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
            <select className={styles.select} value={role} onChange={(e) => { setPage(1); setRole(e.target.value); }}>
              <option value="">All roles</option>
              <option>Teacher</option>
              <option>Security</option>
              <option>Admin</option>
              <option>Custodial</option>
              <option>IT</option>
            </select>
            <select className={styles.select} value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
              <option value="">All status</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>
        <div className={styles.cardBody}>
          {loading && <div aria-busy>Loading workers...</div>}
          {error && <div role="alert">Error: {error}</div>}

          {!loading && !error && (
            <>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Tag</th>
                      <th>Last Seen</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((w) => (
                      <tr key={w.id} className={styles.tableRow}>
                        <td>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", minWidth: 180 }}>
                            {w.photoUrl ? (
                              <img 
                                src={w.photoUrl} 
                                alt={w.name}
                                style={{ 
                                  width: 36, 
                                  height: 36, 
                                  borderRadius: "50%", 
                                  objectFit: "cover",
                                  flexShrink: 0,
                                  border: "2px solid #e5e7eb"
                                }}
                              />
                            ) : (
                              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e5e7eb", display: "grid", placeItems: "center", fontSize: 12, flexShrink: 0, fontWeight: 600 }}>
                                {w.name.split(" ").map((p) => p[0]).join("")}
                              </div>
                            )}
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{w.name}</div>
                              <div style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{w.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{w.role}</td>
                        <td>{w.department}</td>
                        <td>
                          <span className={styles.badge + " " + (w.status === "active" ? styles.statusOnline : styles.statusOffline)}>
                            {w.status}
                          </span>
                        </td>
                        <td>{w.tagId || "—"}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{w.lastSeen ? new Date(w.lastSeen).toLocaleString() : "—"}</td>
                        <td>
                          <div className={styles.controls}>
                            <button className={styles.button} onClick={() => handleView(w)}>View</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12 }}>
                  <div className={styles.controls}>
                    <button className={styles.button} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
                    <span style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>Page {page} / {totalPages}</span>
                    <button className={styles.button} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
                  </div>
                  <div className={styles.controls}>
                    <label style={{ fontSize: 12, color: "#6b7280" }}>Rows:</label>
                    <select className={styles.select} value={pageSize} onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={30}>30</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Worker Detail Modal */}
      {selectedWorker && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20
        }} onClick={handleClose}>
          <div style={{
            background: "white",
            borderRadius: 16,
            maxWidth: 600,
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              padding: 24,
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Worker Profile</h2>
              <button onClick={handleClose} style={{
                background: "none",
                border: "none",
                fontSize: 24,
                cursor: "pointer",
                color: "#6b7280"
              }}>×</button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Profile Picture */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                {selectedWorker.photoUrl ? (
                  <img 
                    src={selectedWorker.photoUrl} 
                    alt={selectedWorker.name}
                    style={{ 
                      width: 120, 
                      height: 120, 
                      borderRadius: "50%", 
                      objectFit: "cover",
                      border: "4px solid #e5e7eb"
                    }}
                  />
                ) : (
                  <div style={{ 
                    width: 120, 
                    height: 120, 
                    borderRadius: "50%", 
                    background: "#e5e7eb", 
                    display: "grid", 
                    placeItems: "center", 
                    fontSize: 36, 
                    fontWeight: 700 
                  }}>
                    {selectedWorker.name.split(" ").map((p) => p[0]).join("")}
                  </div>
                )}
              </div>

              {/* Information Form */}
              {isEditing && editForm ? (
                <div style={{ display: "grid", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Full Name</label>
                    <input 
                      className={styles.input}
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Email</label>
                    <input 
                      className={styles.input}
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Role</label>
                      <select 
                        className={styles.select}
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      >
                        <option>Teacher</option>
                        <option>Security</option>
                        <option>Admin</option>
                        <option>Custodial</option>
                        <option>IT</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Department</label>
                      <input 
                        className={styles.input}
                        value={editForm.department}
                        onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Tag ID</label>
                    <input 
                      className={styles.input}
                      value={editForm.tagId || ""}
                      onChange={(e) => setEditForm({ ...editForm, tagId: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Status</label>
                    <select 
                      className={styles.select}
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as "active" | "disabled" })}
                    >
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Signature</label>
                    <input 
                      className={styles.input}
                      placeholder="Type your signature"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      style={{ fontFamily: "cursive", fontSize: 18 }}
                    />
                    {signature && (
                      <div style={{ 
                        marginTop: 8, 
                        padding: 12, 
                        background: "#f9fafb", 
                        borderRadius: 8,
                        fontFamily: "cursive",
                        fontSize: 24,
                        textAlign: "center",
                        border: "1px solid #e5e7eb"
                      }}>
                        {signature}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "#6b7280" }}>Full Name:</span>
                    <span style={{ fontWeight: 700 }}>{selectedWorker.name}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "#6b7280" }}>Email:</span>
                    <span>{selectedWorker.email}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "#6b7280" }}>Role:</span>
                    <span>{selectedWorker.role}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "#6b7280" }}>Department:</span>
                    <span>{selectedWorker.department}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "#6b7280" }}>Tag ID:</span>
                    <span>{selectedWorker.tagId || "—"}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "#6b7280" }}>Status:</span>
                    <span className={styles.badge + " " + (selectedWorker.status === "active" ? styles.statusOnline : styles.statusOffline)}>
                      {selectedWorker.status}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "#6b7280" }}>Last Seen:</span>
                    <span>{selectedWorker.lastSeen ? new Date(selectedWorker.lastSeen).toLocaleString() : "—"}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
                {isEditing ? (
                  <>
                    <button 
                      className={styles.button}
                      onClick={() => setIsEditing(false)}
                      style={{ background: "#f3f4f6" }}
                    >
                      Cancel
                    </button>
                    <button 
                      className={styles.button}
                      onClick={handleSave}
                      style={{ background: "#8b3b3b", color: "white" }}
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button 
                    className={styles.button}
                    onClick={handleEdit}
                    style={{ background: "#8b3b3b", color: "white" }}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
