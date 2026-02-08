"use client";

import React, { useEffect, useMemo, useState } from "react";
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

  return (
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
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#e5e7eb", display: "grid", placeItems: "center", fontSize: 12 }}>
                        {s.name.split(" ").map((p) => p[0]).join("")}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{s.email}</div>
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
                  <td>{s.lastSeen ? new Date(s.lastSeen).toLocaleString() : "—"}</td>
                  <td>
                    <div className={styles.controls}>
                      <Link className={styles.button} href={`/dashboard/students/${s.id}`}>View</Link>
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
