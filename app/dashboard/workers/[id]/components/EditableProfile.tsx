"use client";

import React, { useState } from "react";
import styles from "../../../styles.module.css";

interface Worker {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  tagId: string | null;
  location: string | null;
  emergencyContact: string | null;
  emergencyPhone: string | null;
  photoUrl?: string;
}

export default function EditableProfile({ worker }: { worker: Worker }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    location: worker.location || "",
    emergencyContact: worker.emergencyContact || "",
    emergencyPhone: worker.emergencyPhone || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/workers/${worker.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update");
      
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Overview</h2>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={isSaving}
            style={{
              padding: "8px 16px",
              background: isEditing ? "#10b981" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {isSaving ? "Saving..." : isEditing ? "Save" : "Edit"}
          </button>
        </div>
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
        <div className={styles.cardHeader}><h2>Location & Emergency Contact</h2></div>
        <div className={styles.cardBody}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter location"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    fontSize: 14,
                  }}
                />
              ) : (
                <div style={{ padding: "8px 0", fontSize: 14, color: "#6b7280" }}>
                  {worker.location || "Not set"}
                </div>
              )}
            </div>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                Emergency Contact Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="Enter contact name"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    fontSize: 14,
                  }}
                />
              ) : (
                <div style={{ padding: "8px 0", fontSize: 14, color: "#6b7280" }}>
                  {worker.emergencyContact || "Not set"}
                </div>
              )}
            </div>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                Emergency Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  placeholder="Enter phone number"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    fontSize: 14,
                  }}
                />
              ) : (
                <div style={{ padding: "8px 0", fontSize: 14, color: "#6b7280" }}>
                  {worker.emergencyPhone || "Not set"}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
