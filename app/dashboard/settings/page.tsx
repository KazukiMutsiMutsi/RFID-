"use client";
import { useState } from "react";
import styles from "../styles.module.css";
import { useDashboard } from "../context/DashboardContext";

export default function Settings() {
  const { profile, updateProfile, changePassword } = useDashboard();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [status, setStatus] = useState<string | null>(null);

  const [curr, setCurr] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email });
    setStatus("Profile updated");
    setTimeout(() => setStatus(null), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) {
      setPwMsg("New passwords do not match");
      return;
    }

    const ok = changePassword(curr, next);
    if (!ok) {
      setPwMsg("Current password is incorrect");
    } else {
      setPwMsg("Password changed successfully");
      setCurr("");
      setNext("");
      setConfirm("");
      setTimeout(() => setPwMsg(null), 3000);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Settings</h1>
          <p className={styles.small}>Manage your profile and password.</p>
        </div>
      </div>

      <section style={{ maxWidth: 640 }}>
        <h3>Profile</h3>
        <form onSubmit={saveProfile} style={{ display: 'grid', gap: 10 }}>
          <label>Name</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} style={{ padding: 8 }} />
          <label>Email</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} style={{ padding: 8 }} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn secondary" type="button" onClick={() => { setName(profile.name); setEmail(profile.email); }}>Revert</button>
            <button className="btn" type="submit">Save Profile</button>
          </div>
          {status && <p className={styles.small}>{status}</p>}
        </form>

        <hr style={{ margin: '24px 0' }} />

        <h3>Change Password</h3>
        <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: 10 }}>
          <label>Current password</label>
          <input type="password" value={curr} onChange={(e)=>setCurr(e.target.value)} style={{ padding: 8 }} />

          <label>New password</label>
          <input type="password" value={next} onChange={(e)=>setNext(e.target.value)} style={{ padding: 8 }} />

          <label>Confirm new password</label>
          <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} style={{ padding: 8 }} />

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn secondary" type="button" onClick={() => { setCurr(''); setNext(''); setConfirm(''); }}>Clear</button>
            <button className="btn" type="submit">Change Password</button>
          </div>

          {pwMsg && <p className={styles.small}>{pwMsg}</p>}
        </form>
      </section>
    </main>
  );
}