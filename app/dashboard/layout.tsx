"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";
import { DashboardProvider } from "./context/DashboardContext";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const nav = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/workers", label: "Workers" },
    { href: "/dashboard/tags", label: "Tags" },
    { href: "/dashboard/reports", label: "Reports" },
    { href: "/dashboard/settings", label: "Settings" },
  ];

  return (
    <div className={styles.wrapper} data-sidebar-open={open ? "true" : "false"}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <img src="/bc-logo.png" alt="Logo" className={styles.brandLogo} />
          <div className={styles.brandText}>
            <strong>School RFID</strong>
            <span className={styles.small}>Admin</span>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Main navigation">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={pathname === n.href ? `${styles.link} ${styles.active}` : styles.link}
              onClick={() => setOpen(false)}
            >
              <span className={styles.linkLabel}>{n.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <small className={styles.small}>v0.1 • Local</small>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.leftControls}>
            <button
              aria-label="Toggle menu"
              className={styles.hamburger}
              onClick={() => setOpen((s) => !s)}
            >
              ☰
            </button>
            <h1 className={styles.pageTitle}>Dashboard</h1>
          </div>

          <div className={styles.rightControls}>
            <div className={styles.searchWrap}>
              <input
                className={styles.search}
                placeholder="Search workers, tags..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val.length) router.push(`/dashboard/workers?q=${encodeURIComponent(val)}`);
                  }
                }}
              />
            </div>

            <button aria-label="Notifications" className={styles.iconBtn}>
              🔔
            </button>

            <div className={styles.avatar} title="Admin">N</div>
          </div>
        </header>

        <main className={styles.content}>
          <DashboardProvider>{children}</DashboardProvider>
        </main>
      </div>
    </div>
  );
}
