"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";
import { DashboardProvider } from "./context/DashboardContext";
import { useRouter } from "next/navigation";
import NotificationBell from "./components/NotificationBell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const nav = [
    { href: "/dashboard",            label: "Overview",    icon: "🏠", desc: "Home" },
    { href: "/dashboard/attendance", label: "Attendance",  icon: "📋", desc: "Track" },
    { href: "/dashboard/students",   label: "Students",    icon: "👨‍🎓", desc: "Records" },
    { href: "/dashboard/tags",       label: "RFID Tags",   icon: "🏷️", desc: "Assign" },
    { href: "/dashboard/reports",    label: "Reports",     icon: "📊", desc: "Export" },
    { href: "/dashboard/settings",   label: "Settings",    icon: "⚙️", desc: "Config" },
  ];

  return (
    <div className={styles.wrapper} data-sidebar-open={open ? "true" : "false"}>
      <div className={styles.overlay} onClick={() => setOpen(false)} />

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandLogoWrap}>
            <img src="/bc-logo.png" alt="Logo" className={styles.brandLogo} />
          </div>
          <div className={styles.brandText}>
            <strong>School RFID</strong>
            <span className={styles.brandSub}>Admin Portal</span>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Nav label */}
        <div className={styles.navSection}>NAVIGATION</div>

        <nav className={styles.nav} aria-label="Main navigation">
          {nav.map((n) => {
            const isActive = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={isActive ? `${styles.link} ${styles.active}` : styles.link}
                onClick={() => setOpen(false)}
              >
                <span className={styles.linkIcon}>{n.icon}</span>
                <span className={styles.linkLabel}>{n.label}</span>
                {isActive && <span className={styles.linkPip} />}
              </Link>
            );
          })}
        </nav>

        <div className={styles.divider} />

        {/* Sidebar footer */}
        <div className={styles.sidebarFooter}>
          <div className={styles.footerBadge}>
            <span className={styles.footerDot} />
            System Online
          </div>
          <div className={styles.footerVersion}>v0.1 • Local</div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.leftControls}>
            <button
              aria-label="Toggle menu"
              className={styles.hamburger}
              onClick={() => setOpen((s) => !s)}
            >
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </button>
            <div className={styles.breadcrumb}>
              <span className={styles.breadcrumbRoot}>Dashboard</span>
              {pathname !== "/dashboard" && (
                <>
                  <span className={styles.breadcrumbSep}>/</span>
                  <span className={styles.breadcrumbCurrent}>
                    {nav.find((n) => pathname.startsWith(n.href) && n.href !== "/dashboard")?.label ?? ""}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className={styles.rightControls}>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                className={styles.search}
                placeholder="Search students, tags..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val.length) router.push(`/dashboard/students?q=${encodeURIComponent(val)}`);
                  }
                }}
              />
            </div>

            <NotificationBell />

            <div className={styles.adminChip}>
              <div className={styles.avatar} title="Admin">A</div>
              <div className={styles.adminInfo}>
                <div className={styles.adminName}>Admin</div>
                <div className={styles.adminRole}>Super Admin</div>
              </div>
            </div>

            <button
              className={styles.logoutBtn}
              onClick={() => router.push("/")}
              title="Log out"
            >
              ← Logout
            </button>
          </div>
        </header>

        <main className={styles.content}>
          <DashboardProvider>{children}</DashboardProvider>
        </main>
      </div>
    </div>
  );
}
