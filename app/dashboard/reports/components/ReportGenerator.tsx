"use client";

import { useState } from "react";
import styles from "../../styles.module.css";

type ReportType = "attendance" | "events" | "students" | "workers" | "tags" | "doors";

export default function ReportGenerator() {
  const [reportType, setReportType] = useState<ReportType>("attendance");
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split("T")[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [format, setFormat] = useState<"csv" | "pdf" | "excel">("csv");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const params = new URLSearchParams({
        type: reportType,
        dateFrom,
        dateTo,
        format,
      });

      if (filterGrade) params.set("grade", filterGrade);
      if (filterStatus) params.set("status", filterStatus);

      const res = await fetch(`/api/reports/generate?${params.toString()}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${reportType}-report-${dateFrom}-to-${dateTo}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
        
        alert("Report generated successfully!");
      } else {
        alert("Failed to generate report");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2>Generate Report</h2>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
            Create custom reports with filters
          </div>
        </div>
      </div>
      <div className={styles.cardBody}>
        <div style={{ display: "grid", gap: 16 }}>
          {/* Report Type */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontWeight: 600, fontSize: 14 }}>Report Type</label>
            <select
              className={styles.select}
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
            >
              <option value="attendance">Attendance Report</option>
              <option value="events">Event Logs</option>
              <option value="students">Student Directory</option>
              <option value="workers">Worker Directory</option>
              <option value="tags">Tag Inventory</option>
              <option value="doors">Door Activity</option>
            </select>
          </div>

          {/* Date Range */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontWeight: 600, fontSize: 14 }}>From Date</label>
              <input
                className={styles.input}
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontWeight: 600, fontSize: 14 }}>To Date</label>
              <input
                className={styles.input}
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          {(reportType === "attendance" || reportType === "students") && (
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontWeight: 600, fontSize: 14 }}>Filter by Grade</label>
              <select
                className={styles.select}
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
              >
                <option value="">All Grades</option>
                {[7, 8, 9, 10, 11, 12].map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </div>
          )}

          {reportType === "attendance" && (
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontWeight: 600, fontSize: 14 }}>Filter by Status</label>
              <select
                className={styles.select}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
              </select>
            </div>
          )}

          {/* Export Format */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontWeight: 600, fontSize: 14 }}>Export Format</label>
            <div style={{ display: "flex", gap: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={format === "csv"}
                  onChange={(e) => setFormat(e.target.value as any)}
                />
                <span style={{ fontSize: 14 }}>CSV</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={format === "pdf"}
                  onChange={(e) => setFormat(e.target.value as any)}
                />
                <span style={{ fontSize: 14 }}>PDF</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <input
                  type="radio"
                  name="format"
                  value="excel"
                  checked={format === "excel"}
                  onChange={(e) => setFormat(e.target.value as any)}
                />
                <span style={{ fontSize: 14 }}>Excel</span>
              </label>
            </div>
          </div>

          {/* Report Description */}
          <div
            style={{
              padding: 12,
              background: "#f9fafb",
              borderRadius: 8,
              fontSize: 13,
              color: "#374151",
            }}
          >
            <strong>Report will include:</strong>
            <ul style={{ margin: "8px 0 0 0", paddingLeft: 20 }}>
              {reportType === "attendance" && (
                <>
                  <li>Daily attendance records</li>
                  <li>Check-in/check-out times</li>
                  <li>Attendance status and rates</li>
                  <li>Late arrivals and absences</li>
                </>
              )}
              {reportType === "events" && (
                <>
                  <li>All RFID scan events</li>
                  <li>Door access logs</li>
                  <li>Entry/exit timestamps</li>
                  <li>Denied access attempts</li>
                </>
              )}
              {reportType === "students" && (
                <>
                  <li>Student information</li>
                  <li>Grade and section details</li>
                  <li>Tag assignments</li>
                  <li>Contact information</li>
                </>
              )}
              {reportType === "workers" && (
                <>
                  <li>Worker information</li>
                  <li>Role and department</li>
                  <li>Tag assignments</li>
                  <li>Access permissions</li>
                </>
              )}
              {reportType === "tags" && (
                <>
                  <li>Tag inventory</li>
                  <li>Assignment status</li>
                  <li>Issue and revoke dates</li>
                  <li>Last seen timestamps</li>
                </>
              )}
              {reportType === "doors" && (
                <>
                  <li>Door activity summary</li>
                  <li>Traffic patterns</li>
                  <li>Peak usage times</li>
                  <li>Reader status history</li>
                </>
              )}
            </ul>
          </div>

          {/* Generate Button */}
          <button
            className={styles.button}
            onClick={handleGenerate}
            disabled={generating}
            style={{
              background: "#8b3b3b",
              color: "white",
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {generating ? "Generating..." : "📊 Generate Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
