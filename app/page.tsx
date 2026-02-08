"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LandingPage.module.css";

export default function Home() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGetStarted = () => {
    setShowLogin(true);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        let message = "Invalid email or password";
        try {
          const data = await res.json();
          message = data?.error || message;
        } catch (_) {
          // keep default message
        }
        setError(message);
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <>
      <header className={styles.hero}>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <div className={styles.navBrand}>
              <span className={styles.brandMark} aria-hidden="true">RF</span>
              <span>School RFID Command</span>
            </div>
            <div className={styles.navLinks}>
              <button className={styles.navGhost} onClick={handleGetStarted}>
                Sign in
              </button>
            </div>
          </nav>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span className={styles.heroBadge}>Campus Safety Suite</span>
              <h1 className={styles.heroTitle}>
                RFID-powered presence. <span className={styles.highlight}>Instant</span> visibility.
              </h1>
              <p className={styles.heroSubtitle}>
                Track student, staff, and visitor movement in real time with secure RFID readers,
                automated attendance, and actionable alerts.
              </p>
              <div className={styles.heroCtas}>
                <button className={styles.ctaPrimary} onClick={handleGetStarted}>
                  Sign in
                </button>
              </div>
              <div className={styles.statsRow}>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>99.7%</span>
                  <span className={styles.statLabel}>Attendance capture rate</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>24/7</span>
                  <span className={styles.statLabel}>Zone monitoring</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>3 sec</span>
                  <span className={styles.statLabel}>Alert response time</span>
                </div>
              </div>
            </div>

            <div className={styles.heroPanel} aria-hidden="true">
              <div className={styles.signalPulse}>
                <span className={styles.pulseRing}></span>
                <span className={styles.pulseRing}></span>
                <span className={styles.pulseRing}></span>
              </div>
              <div className={styles.idCard}>
                <div className={styles.idHeader}>
                  <img src="/bc-logo.png" alt="Benedicto College logo" className={styles.bcLogo} loading="eager" />
                  <div>
                    <p className={styles.idName}>Benedicto College</p>
                    <p className={styles.idMeta}>RFID Secure Campus</p>
                  </div>
                </div>
                <div className={styles.idRow}>
                  <span>Gate 2 - Library</span>
                  <span className={styles.idStatus}>ACTIVE</span>
                </div>
                <div className={styles.idRow}>
                  <span>Last scan</span>
                  <span>08:42 AM</span>
                </div>
                <div className={styles.idRow}>
                  <span>Reader status</span>
                  <span className={styles.idOnline}>Online</span>
                </div>
                <div className={styles.idTag}>
                  <span>Tag UID</span>
                  <strong>UID-7F39A1</strong>
                </div>
              </div>
              <div className={styles.zoneList}>
                <div>
                  <p className={styles.zoneTitle}>Zones</p>
                  <p className={styles.zoneValue}>Main Gate · Library · Gym</p>
                </div>
                <span className={styles.zoneBadge}>All clear</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Live dashboard preview</h2>
            <p>Static snapshot of campus activity and RFID reader status.</p>
          </div>
          <div className={styles.dashboardPreview}>
            <div className={styles.previewHeader}>
              <div>
                <p className={styles.previewTitle}>RFID Command Dashboard</p>
                <p className={styles.previewSub}>Attendance, readers, and alerts at a glance</p>
              </div>
              <span className={styles.previewBadge}>Preview</span>
            </div>
            <div className={styles.previewGrid}>
              <div className={styles.previewCard}>
                <p className={styles.previewLabel}>Students Present</p>
                <h3>1,248</h3>
                <span className={styles.previewDelta}>+3.2% today</span>
              </div>
              <div className={styles.previewCard}>
                <p className={styles.previewLabel}>Active Readers</p>
                <h3>18 / 20</h3>
                <span className={styles.previewDelta}>2 offline</span>
              </div>
              <div className={styles.previewCard}>
                <p className={styles.previewLabel}>Alerts</p>
                <h3>4</h3>
                <span className={styles.previewDelta}>1 critical</span>
              </div>
            </div>
            <div className={styles.previewTable}>
              <div className={styles.previewRow}>
                <span>Gate 1 - Main Entrance</span>
                <span>Online</span>
                <span>08:45 AM</span>
              </div>
              <div className={styles.previewRow}>
                <span>Library - East Wing</span>
                <span>Online</span>
                <span>08:44 AM</span>
              </div>
              <div className={styles.previewRow}>
                <span>Gym Entrance</span>
                <span>Offline</span>
                <span>08:32 AM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>How it works</h2>
            <p>From scan to report in under a minute.</p>
          </div>
          <div className={styles.steps}>
            <div className={styles.stepCard}>
              <span className={styles.stepIndex}>01</span>
              <h3>Tap & identify</h3>
              <p>RFID tags are read at gates, classrooms, and activity zones.</p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepIndex}>02</span>
              <h3>Verify & log</h3>
              <p>Each scan validates status and creates a secure attendance record.</p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepIndex}>03</span>
              <h3>Act & report</h3>
              <p>Dashboards update live with alerts and export-ready reports.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="login" className={styles.loginSection}>
        <div className={styles.container}>
          <div className={styles.loginGrid}>
            <div className={styles.loginCopy}>
              <h2>Sign in to the command center</h2>
              <p>
                Access the live campus dashboard, reports, and RFID management tools designed for
                school leaders.
              </p>
              <div className={styles.loginHighlights}>
                <span>Encrypted activity logs</span>
                <span>Daily attendance exports</span>
                <span>Role-based access</span>
              </div>
            </div>
            <div className={styles.loginPanel}>
              <p className={styles.loginPanelTitle}>Secure Access</p>
              <p className={styles.loginPanelCopy}>
                Use your school RFID credentials to enter the secure dashboard.
              </p>
              <button className={styles.ctaPrimary} onClick={handleGetStarted}>
                Sign in
              </button>
            </div>
          </div>
        </div>
      </section>

      {showLogin && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3>Sign in</h3>
              <button className={styles.modalClose} onClick={() => setShowLogin(false)} aria-label="Close">
                ×
              </button>
            </div>
            <form className={styles.modalForm} onSubmit={handleLogin}>
              <label>
                Email
                <input
                  type="email"
                  placeholder="admin@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              {error && <p className={styles.error}>{error}</p>}
              <button type="submit" className={styles.ctaPrimary}>
                Continue
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
