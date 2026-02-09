"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "../../styles.module.css";

type Student = {
  id: string;
  name: string;
  email: string;
  grade: number;
  section: string;
  status: "active" | "disabled";
  tagId: string | null;
  lastSeen: string | null;
  photoUrl?: string;
};

type ResponseList = {
  data: Student[];
  page: number;
  pageSize: number;
  total: number;
};

export default function StudentsTable() {
  const [rows, setRows] = useState<Student[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Student | null>(null);
  const [signature, setSignature] = useState("");

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  useEffect(() => {
    let mounted = true;
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
        if (search) params.set("search", search);
        if (grade) params.set("grade", grade);
        if (status) params.set("status", status);

        const res = await fetch(`/api/students?${params.toString()}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load students");
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
    fetchStudents();
  }, [page, pageSize, search, grade, status]);

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setEditForm(student);
    setIsEditing(false);
    setSignature("");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editForm) {
      // Update the student in the list
      setRows(rows.map(s => s.id === editForm.id ? editForm : s));
      setSelectedStudent(editForm);
      setIsEditing(false);
      alert("Student information updated successfully!");
    }
  };

  const handleClose = () => {
    setSelectedStudent(null);
    setIsEditing(false);
    setEditForm(null);
    setSignature("");
  };

  return (
    <>
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Students</h2>
          <div className={styles.controls}>
            <input className={styles.input} placeholder="Search name/email/tag" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
            <select className={styles.select} value={grade} onChange={(e) => { setPage(1); setGrade(e.target.value); }}>
              <option value="">All grades</option>
              {[7, 8, 9, 10, 11, 12].map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <select className={styles.select} value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
              <option value="">All status</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>
        <div className={styles.cardBody}>
          {loading && <div aria-busy>Loading students...</div>}
          {error && <div role="alert">Error: {error}</div>}

          {!loading && !error && (
            <>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Grade</th>
                      <th>Section</th>
                      <th>Status</th>
                      <th>Tag</th>
                      <th>Last Seen</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((s) => (
                      <tr key={s.id} className={styles.tableRow}>
                        <td>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", minWidth: 180 }}>
                            {s.photoUrl ? (
                              <img 
                                src={s.photoUrl} 
                                alt={s.name}
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
                                {s.name.split(" ").map((p) => p[0]).join("")}
                              </div>
                            )}
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                              <div style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{s.grade}</td>
                        <td>{s.section}</td>
                        <td>
                          <span className={styles.badge + " " + (s.status === "active" ? styles.statusOnline : styles.statusOffline)}>
                            {s.status}
                          </span>
                        </td>
                        <td>{s.tagId || "—"}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{s.lastSeen ? new Date(s.lastSeen).toLocaleString() : "—"}</td>
                        <td>
                          <div className={styles.controls}>
                            <button className={styles.button} onClick={() => handleView(s)}>View</button>
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

      {/* Student Detail Modal */}
      {selectedStudent && (
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
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Student Profile</h2>
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
                {selectedStudent.photoUrl ? (
                  <img 
                    src={selectedStudent.photoUrl} 
                    alt={selectedStudent.name}
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
                    {selectedStudent.name.split(" ").map((p) => p[0]).join("")}
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
                      <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Grade</label>
                      <select 
                        className={styles.select}
                        value={editForm.grade}
                        onChange={(e) => setEditForm({ ...editForm, grade: Number(e.target.value) })}
                      >
                        {[7, 8, 9, 10, 11, 12].map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Section</label>
                      <input 
                        className={styles.input}
                        value={editForm.section}
                        onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
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
                    <span style={{ fontWeight: 700 }}>{selectedStudent.name}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "#6b7280" }}>Email:</span>
                    <span>{selectedStudent.email}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "#6b7280" }}>Grade:</span>
                    <span>{selectedStudent.grade}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "#6b7280" }}>Section:</span>
                    <span>{selectedStudent.section}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "#6b7280" }}>Tag ID:</span>
                    <span>{selectedStudent.tagId || "—"}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "#6b7280" }}>Status:</span>
                    <span className={styles.badge + " " + (selectedStudent.status === "active" ? styles.statusOnline : styles.statusOffline)}>
                      {selectedStudent.status}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "#6b7280" }}>Last Seen:</span>
                    <span>{selectedStudent.lastSeen ? new Date(selectedStudent.lastSeen).toLocaleString() : "—"}</span>
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
