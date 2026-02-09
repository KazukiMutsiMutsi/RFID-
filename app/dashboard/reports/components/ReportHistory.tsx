"use client";

import { useEffect, useState } from "react";
import styles from "../../styles.module.css";

type Report = {
  id: string;
  type: string;
  name: string;
  dateFrom: string;
  dateTo: string;
  format: string;
  generatedAt: string;
  generatedBy: string;
  size: string;
};

export default function ReportHistory() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports/history", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error("Failed to fetch report history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (reportId: string) => {
    // In a real app, download the report file
    alert(`Downloading report ${reportId}`);
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      const res = await fetch(`/api/reports/${reportId}`, { method: "DELETE" });
      if (res.ok) {
        await fetchReports();
      } else {
        alert("Failed to delete report");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2>Report History</h2>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
            Previously generated reports
          </div>
        </div>
      </div>
      <div className={styles.cardBody}>
        {loading ? (
          <div>Loading report history...</div>
        ) : reports.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: "#6b7280" }}>
            No reports generated yet. Create your first report above.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12, maxHeight: 500, overflowY: "auto" }}>
            {reports.map((report) => (
              <div
                key={report.id}
                className={styles.card}
                style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
              >
                <div className={styles.cardBody} style={{ padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{report.name}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                        {new Date(report.dateFrom).toLocaleDateString()} - {new Date(report.dateTo).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={styles.badge}
                      style={{
                        background: "#dbeafe",
                        color: "#1e40af",
                        textTransform: "uppercase",
                      }}
                    >
                      {report.format}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#6b7280" }}>
                    <div>
                      <div>Generated: {new Date(report.generatedAt).toLocaleString()}</div>
                      <div>By: {report.generatedBy} • Size: {report.size}</div>
                    </div>
                    <div className={styles.controls}>
                      <button
                        className={styles.button}
                        onClick={() => handleDownload(report.id)}
                        style={{ fontSize: 12, padding: "4px 8px" }}
                      >
                        📥 Download
                      </button>
                      <button
                        className={styles.button}
                        onClick={() => handleDelete(report.id)}
                        style={{ fontSize: 12, padding: "4px 8px", color: "#dc2626" }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
