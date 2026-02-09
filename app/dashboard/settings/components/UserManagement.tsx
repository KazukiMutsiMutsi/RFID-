"use client";

import { useState, useEffect } from "react";
import styles from "../../styles.module.css";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "security" | "staff";
  status: "active" | "inactive";
  lastLogin: string | null;
  createdAt: string;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff" as User["role"],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Check if email already exists (for new users)
    if (!editingUser) {
      const emailExists = users.some(
        (user) => user.email.toLowerCase() === formData.email.toLowerCase()
      );
      
      if (emailExists) {
        setError("This email is already in use. Please use a different email.");
        return;
      }
    }

    // Check if email is being changed to an existing one (for editing)
    if (editingUser && editingUser.email !== formData.email) {
      const emailExists = users.some(
        (user) => user.email.toLowerCase() === formData.email.toLowerCase() && user.id !== editingUser.id
      );
      
      if (emailExists) {
        setError("This email is already in use. Please use a different email.");
        return;
      }
    }
    
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
      const method = editingUser ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save user");
        return;
      }

      await fetchUsers();
      handleCloseModal();
      alert(editingUser ? "User updated successfully!" : "User created successfully! They will receive an email notification.");
    } catch (error) {
      console.error("Error saving user:", error);
      setError("Error saving user. Please try again.");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        await fetchUsers();
        alert("User deleted successfully");
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setError("");
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "staff" });
    setError("");
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return { bg: "#fee2e2", color: "#991b1b" };
      case "teacher": return { bg: "#dbeafe", color: "#1e40af" };
      case "security": return { bg: "#fef3c7", color: "#92400e" };
      default: return { bg: "#f3f4f6", color: "#374151" };
    }
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>User Management</h2>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
              Manage system users and their access levels. Users will receive email notifications.
            </div>
          </div>
          <button className={styles.button} onClick={() => setShowAddModal(true)}>
            ➕ Add User
          </button>
        </div>
        <div className={styles.cardBody}>
          {loading ? (
            <div>Loading users...</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const roleColors = getRoleBadgeColor(user.role);
                    return (
                      <tr key={user.id} className={styles.tableRow}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{user.name}</div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span
                            className={styles.badge}
                            style={{ background: roleColors.bg, color: roleColors.color }}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span
                            className={styles.badge + " " + (user.status === "active" ? styles.statusOnline : styles.statusOffline)}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
                        </td>
                        <td>
                          <div className={styles.controls}>
                            <button className={styles.button} onClick={() => handleEdit(user)}>
                              Edit
                            </button>
                            <button
                              className={styles.button}
                              onClick={() => handleDelete(user.id)}
                              style={{ color: "#dc2626" }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "grid",
            placeItems: "center",
            zIndex: 50,
            padding: 24,
          }}
          onClick={handleCloseModal}
        >
          <div
            className={styles.card}
            style={{ width: "min(500px, 100%)", maxHeight: "90vh", overflow: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.cardHeader}>
              <h2>{editingUser ? "Edit User" : "Add New User"}</h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 24,
                  cursor: "pointer",
                  padding: 0,
                  width: 32,
                  height: 32,
                }}
              >
                ×
              </button>
            </div>
            <div className={styles.cardBody}>
              <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
                {error && (
                  <div
                    style={{
                      padding: 12,
                      background: "#fee2e2",
                      color: "#991b1b",
                      borderRadius: 8,
                      fontSize: 14,
                      border: "1px solid #fecaca",
                    }}
                  >
                    ⚠️ {error}
                  </div>
                )}

                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontWeight: 600, fontSize: 14 }}>Full Name *</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontWeight: 600, fontSize: 14 }}>Email *</label>
                  <input
                    className={styles.input}
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setError(""); // Clear error when user types
                    }}
                    required
                  />
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    User will receive notifications at this email address
                  </div>
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontWeight: 600, fontSize: 14 }}>
                    Password {editingUser && "(leave blank to keep current)"}
                  </label>
                  <input
                    className={styles.input}
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                    minLength={6}
                  />
                  {!editingUser && (
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      Minimum 6 characters
                    </div>
                  )}
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontWeight: 600, fontSize: 14 }}>Role *</label>
                  <select
                    className={styles.select}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as User["role"] })}
                    required
                  >
                    <option value="staff">Staff - Limited access</option>
                    <option value="teacher">Teacher - Student records & attendance</option>
                    <option value="security">Security - Door logs & alerts</option>
                    <option value="admin">Admin - Full system access</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                  <button type="button" className={styles.button} onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.button}
                    style={{ background: "#8b3b3b", color: "white" }}
                  >
                    {editingUser ? "Update User" : "Create User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
