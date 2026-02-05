"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Worker = { id: string; name: string; tag: string; status: "Present" | "Absent" };
type Tag = { id: string; assignedTo: string; status: "Active" | "Inactive" };

type Profile = { name: string; email: string };

type DashboardState = {
  workers: Worker[];
  tags: Tag[];
  profile: Profile;
  updateProfile: (p: Profile) => void;
  changePassword: (current: string, next: string) => boolean;
  assignTag: (workerId: string, tagId: string) => void;
  editWorker: (updated: Worker) => void;
  registerTag: (tagId: string) => void;
  deactivateTag: (tagId: string) => void;
  toggleWorkerStatus: (workerId: string) => void;
};

const defaultWorkers: Worker[] = [
  { id: "W-001", name: "Jose Ramos", tag: "TAG-034", status: "Present" },
  { id: "W-002", name: "Maria Cruz", tag: "TAG-017", status: "Present" },
  { id: "W-003", name: "Samuel Dela", tag: "TAG-002", status: "Absent" },
  { id: "W-004", name: "Ana Lopez", tag: "", status: "Absent" },
];

const defaultTags: Tag[] = [
  { id: "TAG-002", assignedTo: "Samuel Dela", status: "Active" },
  { id: "TAG-017", assignedTo: "Maria Cruz", status: "Active" },
  { id: "TAG-034", assignedTo: "Jose Ramos", status: "Active" },
  { id: "TAG-055", assignedTo: "", status: "Inactive" },
];

const ctx = createContext<DashboardState | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [workers, setWorkers] = useState<Worker[]>(() => {
    try {
      const raw = localStorage.getItem("rfid_workers");
      return raw ? JSON.parse(raw) : defaultWorkers;
    } catch {
      return defaultWorkers;
    }
  });

  const [tags, setTags] = useState<Tag[]>(() => {
    try {
      const raw = localStorage.getItem("rfid_tags");
      return raw ? JSON.parse(raw) : defaultTags;
    } catch {
      return defaultTags;
    }
  });

  /* profile & password (demo only: stored in localStorage) */
  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const raw = localStorage.getItem("rfid_profile");
      return raw ? JSON.parse(raw) : { name: "Administrator", email: "admin@school.test" };
    } catch {
      return { name: "Administrator", email: "admin@school.test" };
    }
  });

  const [password, setPassword] = useState<string>(() => {
    try {
      return localStorage.getItem("rfid_admin_password") || "admin123";
    } catch {
      return "admin123";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("rfid_workers", JSON.stringify(workers));
      localStorage.setItem("rfid_tags", JSON.stringify(tags));
      localStorage.setItem("rfid_profile", JSON.stringify(profile));
      localStorage.setItem("rfid_admin_password", password);
    } catch (e) {
      // ignore
    }
  }, [workers, tags, profile, password]);

  const assignTag = (workerId: string, tagId: string) => {
    setWorkers((prev) => {
      return prev.map((w) => (w.id === workerId ? { ...w, tag: tagId, status: "Present" } : w));
    });

    setTags((prev) => {
      // find worker name in current workers state
      const workerName = workers.find((w) => w.id === workerId)?.name || "";
      return prev.map((t) => {
        if (t.id === tagId) return { ...t, assignedTo: workerName, status: "Active" };
        // if this tag was previously assigned to this worker but is not the new tag, unassign
        if (t.assignedTo === workerName && t.id !== tagId) return { ...t, assignedTo: "" };
        return t;
      });
    });
  };

  const editWorker = (updated: Worker) => {
    setWorkers((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
    // also update tag assignment if tag changed
    setTags((prev) => prev.map((t) => (t.assignedTo === updated.name && t.id !== updated.tag ? { ...t, assignedTo: updated.name } : t)));
  };

  const registerTag = (tagId: string) => {
    setTags((prev) => [{ id: tagId, assignedTo: "", status: "Active" }, ...prev]);
  };

  const deactivateTag = (tagId: string) => {
    setTags((prev) => prev.map((t) => (t.id === tagId ? { ...t, status: "Inactive", assignedTo: "" } : t)));
    setWorkers((prev) => prev.map((w) => (w.tag === tagId ? { ...w, tag: "" } : w)));
  };

  const toggleWorkerStatus = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, status: w.status === "Present" ? "Absent" : "Present" } : w))
    );
  };

  const updateProfile = (p: Profile) => {
    setProfile(p);
  };

  const changePassword = (current: string, next: string) => {
    if (current !== password) return false;
    setPassword(next);
    return true;
  };

  const value: DashboardState = {
    workers,
    tags,
    profile,
    updateProfile,
    changePassword,
    assignTag,
    editWorker,
    registerTag,
    deactivateTag,
    toggleWorkerStatus,
  };

  return <ctx.Provider value={value}>{children}</ctx.Provider>;
}

export function useDashboard() {
  const v = useContext(ctx);
  if (!v) throw new Error("useDashboard must be used within DashboardProvider");
  return v;
}
