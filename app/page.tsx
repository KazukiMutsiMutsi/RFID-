"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LandingPage.module.css";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGetStarted = () => {
    const el = document.getElementById("login");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data?.error || "Invalid email or password");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <>
      <header className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.logo}>School RFID</div>

          <div className={styles.heroVisual} aria-hidden="true">
            <img
              src="/bc-logo.png"
              alt="Benedicto College logo"
              className={styles.bcLogo}
              loading="eager"
            />
          </div>

          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              GO <span className={styles.highlight}>FORWARD</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Smart Attendance & Monitoring System for Schools
            </p>

            <div className={styles.heroCtas}>
              <button className={styles.ctaPrimary} onClick={() => router.push('/discover')}>Discover</button>
              <button className={styles.btn} onClick={handleGetStarted}>Sign in</button>
            </div>
          </div>
        </div>
      </header>

      <section id="login" className={styles.loginSection}>
        <div className={styles.container}>
          <h2>Login</h2>
          <form className={styles.loginForm} onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.btn}>
              Login
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
