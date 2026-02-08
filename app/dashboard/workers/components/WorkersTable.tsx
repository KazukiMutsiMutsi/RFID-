"use client";

import React, { useEffect, useMemo, useState } from "react";
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

  return (
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
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#e5e7eb", display: "grid", placeItems: "center", fontSize: 12 }}>
                        {w.name.split(" ").map((p) => p[0]).join("")}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{w.name}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{w.email}</div>
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
                  <td>{w.lastSeen ? new Date(w.lastSeen).toLocaleString() : "—"}</td>
                  <td>
                    <div className={styles.controls}>
                      <Link className={styles.button} href={`/dashboard/workers/${w.id}`}>View</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
          <div className={styles.controls}>
            <button className={styles.button} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
            <span style={{ fontSize: 12, color: "#6b7280" }}>Page {page} / {totalPages}</span>
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
    </section>
  );
}
