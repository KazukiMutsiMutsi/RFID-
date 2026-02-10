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
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState<Worker | null>(null);
  const [signature, setSignature] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

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
    setIsAdding(false);
    setSignature("");
    setPhotoPreview(worker.photoUrl || null);
  };

  const handleAddNew = () => {
    // Generate tag ID with year and sequential number: YYYY-XXXX
    const currentYear = new Date().getFullYear();
    const enrollmentNumber = Math.floor(1 + Math.random() * 9999).toString().padStart(4, '0');
    const randomTagId = `${currentYear}-${enrollmentNumber}`;
    
    const newWorker: Worker = {
      id: `temp-${Date.now()}`,
      name: "",
      email: "",
      role: "Teacher",
      department: "",
      status: "active",
      tagId: randomTagId,
      lastSeen: null,
    };
    setEditForm(newWorker);
    setSelectedWorker(newWorker);
    setIsAdding(true);
    setIsEditing(true);
    setSignature("");
    setPhotoPreview(null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Photo size must be less than 5MB");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        if (editForm) {
          setEditForm({ ...editForm, photoUrl: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    if (editForm) {
      setEditForm({ ...editForm, photoUrl: undefined });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editForm) {
      setShowSaveConfirm(true);
    }
  };

  const confirmSave = () => {
    if (editForm) {
      if (isAdding) {
        // Add new worker to the list
        const newWorker = { ...editForm, id: `worker-${Date.now()}` };
        setRows([newWorker, ...rows]);
        setTotal(total + 1);
      } else {
        // Update existing worker
        setRows(rows.map(w => w.id === editForm.id ? editForm : w));
        setSelectedWorker(editForm);
      }
      setShowSaveConfirm(false);
      setIsEditing(false);
      setIsAdding(false);
      handleClose();
      
      // Show success message
      setTimeout(() => {
        alert(isAdding ? "✅ Worker added successfully!" : "✅ Worker updated successfully!");
      }, 100);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedWorker) {
      // Remove worker from the list
      setRows(rows.filter(w => w.id !== selectedWorker.id));
      setTotal(total - 1);
      setShowDeleteConfirm(false);
      handleClose();
      
      // Show success message
      setTimeout(() => {
        alert("🗑️ Worker deleted successfully!");
      }, 100);
    }
  };

  const handleClose = () => {
    setSelectedWorker(null);
    setIsEditing(false);
    setIsAdding(false);
    setEditForm(null);
    setSignature("");
    setPhotoPreview(null);
    setShowDeleteConfirm(false);
    setShowSaveConfirm(false);
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
            <button 
              className={styles.button} 
              onClick={handleAddNew}
              style={{ background: "#8b3b3b", color: "white", fontWeight: 600 }}
            >
              + Add Worker
            </button>
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
          padding: 20,
          overflowY: "auto"
        }} onClick={handleClose}>
          <div style={{
            background: "white",
            borderRadius: 16,
            maxWidth: 700,
            width: "100%",
            maxHeight: "95vh",
            overflow: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            margin: "auto"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              padding: 24,
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
                {isAdding ? "Add New Worker" : "Worker Profile"}
              </h2>
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
              {!isAdding && (
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
              )}

              {/* Information Form */}
              {isEditing && editForm ? (
                <div style={{ display: "grid", gap: 12 }}>
                  {/* Photo Upload Section */}
                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Profile Photo</label>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      {photoPreview ? (
                        <div style={{ position: "relative" }}>
                          <img 
                            src={photoPreview} 
                            alt="Preview"
                            style={{ 
                              width: 100, 
                              height: 100, 
                              borderRadius: "50%", 
                              objectFit: "cover",
                              border: "3px solid #e5e7eb"
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            style={{
                              position: "absolute",
                              top: -5,
                              right: -5,
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              background: "#ef4444",
                              color: "white",
                              border: "2px solid white",
                              cursor: "pointer",
                              fontSize: 14,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div style={{ 
                          width: 100, 
                          height: 100, 
                          borderRadius: "50%", 
                          background: "#f3f4f6", 
                          display: "grid", 
                          placeItems: "center", 
                          fontSize: 40,
                          border: "2px dashed #d1d5db"
                        }}>
                          📷
                        </div>
                      )}
                      <label style={{ cursor: "pointer" }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          style={{ display: "none" }}
                        />
                        <span className={styles.button} style={{ display: "inline-block", background: "#6b7280", color: "white", padding: "6px 12px", fontSize: 13 }}>
                          {photoPreview ? "Change" : "Upload"}
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  <div style={{ borderTop: "1px solid #e5e7eb", margin: "8px 0" }} />
                  
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
                    <div style={{ display: "flex", gap: 8 }}>
                      <input 
                        className={styles.input}
                        value={editForm.tagId || ""}
                        readOnly
                        style={{ flex: 1, background: "#f9fafb", cursor: "not-allowed" }}
                      />
                      <button
                        type="button"
                        className={styles.button}
                        onClick={() => {
                          const currentYear = new Date().getFullYear();
                          const enrollmentNumber = Math.floor(1 + Math.random() * 9999).toString().padStart(4, '0');
                          const newTagId = `${currentYear}-${enrollmentNumber}`;
                          setEditForm({ ...editForm, tagId: newTagId });
                        }}
                        style={{ background: "#6b7280", color: "white", whiteSpace: "nowrap" }}
                      >
                        🔄 Regenerate
                      </button>
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                      Format: YEAR-NUMBER (e.g., 2024-0001)
                    </div>
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
              <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "space-between", flexWrap: "wrap" }}>
                {isEditing ? (
                  <>
                    <div style={{ display: "flex", gap: 12 }}>
                      {!isAdding && (
                        <button 
                          className={styles.button}
                          onClick={handleDelete}
                          style={{ background: "#ef4444", color: "white", border: "none" }}
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
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
                        disabled={!editForm?.name || !editForm?.email}
                      >
                        {isAdding ? "Add Worker" : "Save Changes"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button 
                      className={styles.button}
                      onClick={handleDelete}
                      style={{ background: "#ef4444", color: "white", border: "none" }}
                    >
                      🗑️ Delete
                    </button>
                    <button 
                      className={styles.button}
                      onClick={handleEdit}
                      style={{ background: "#8b3b3b", color: "white" }}
                    >
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation Modal */}
      {showSaveConfirm && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1100,
          padding: 20
        }} onClick={() => setShowSaveConfirm(false)}>
          <div style={{
            background: "white",
            borderRadius: 16,
            maxWidth: 400,
            width: "100%",
            padding: 24,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 48, textAlign: "center", marginBottom: 16 }}>💾</div>
            <h3 style={{ margin: "0 0 12px 0", fontSize: 20, fontWeight: 800, textAlign: "center" }}>
              {isAdding ? "Add Worker?" : "Save Changes?"}
            </h3>
            <p style={{ margin: "0 0 24px 0", color: "#6b7280", textAlign: "center", fontSize: 14 }}>
              {isAdding 
                ? "Are you sure you want to add this worker to the system?" 
                : "Are you sure you want to save these changes?"}
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button 
                className={styles.button}
                onClick={() => setShowSaveConfirm(false)}
                style={{ flex: 1, background: "#f3f4f6" }}
              >
                Cancel
              </button>
              <button 
                className={styles.button}
                onClick={confirmSave}
                style={{ flex: 1, background: "#10b981", color: "white", border: "none" }}
              >
                {isAdding ? "Yes, Add" : "Yes, Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1100,
          padding: 20
        }} onClick={() => setShowDeleteConfirm(false)}>
          <div style={{
            background: "white",
            borderRadius: 16,
            maxWidth: 400,
            width: "100%",
            padding: 24,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 48, textAlign: "center", marginBottom: 16 }}>⚠️</div>
            <h3 style={{ margin: "0 0 12px 0", fontSize: 20, fontWeight: 800, textAlign: "center", color: "#ef4444" }}>
              Delete Worker?
            </h3>
            <p style={{ margin: "0 0 24px 0", color: "#6b7280", textAlign: "center", fontSize: 14 }}>
              Are you sure you want to delete <strong>{selectedWorker?.name}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button 
                className={styles.button}
                onClick={() => setShowDeleteConfirm(false)}
                style={{ flex: 1, background: "#f3f4f6" }}
              >
                Cancel
              </button>
              <button 
                className={styles.button}
                onClick={confirmDelete}
                style={{ flex: 1, background: "#ef4444", color: "white", border: "none" }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
