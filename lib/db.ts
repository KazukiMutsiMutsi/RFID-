/**
 * lib/db.ts — In-memory fake database
 * Data lives in module-level variables so it persists across API requests
 * within the same Next.js server process (survives hot-reload in dev too).
 */

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
export type StudentType = "elementary" | "highschool" | "seniorhigh" | "college";

export type Student = {
  id: string;
  name: string;
  email: string;
  studentType: StudentType;
  grade: number | null;
  section: string | null;
  college: string | null;
  course: string | null;
  status: "active" | "disabled";
  tagId: string | null;
  lastSeen: string | null;
  photoUrl?: string;
  createdAt: string;
};

export type Tag = {
  id: string;
  uid: string;
  status: "unassigned" | "assigned" | "lost" | "disabled" | "retired";
  type: "student" | "visitor";
  ownerId: string | null;
  ownerName: string | null;
  issuedAt: string;
  revokedAt: string | null;
  lastSeen: string | null;
};

export type GateScan = {
  id: string;
  studentId: string;
  studentName: string;
  level: string;
  direction: "in" | "out";
  time: string;
};

export type AdminUser = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "superadmin" | "admin" | "viewer";
};

export type Holiday = {
  id: string;
  date: string;
  name: string;
  type: "regular" | "special" | "school";
};

export type Settings = {
  system: {
    schoolName: string;
    timezone: string;
    dateFormat: string;
    dataRetention: number;
  };
  rfid: {
    readerTimeout: number;
    autoCheckout: boolean;
    checkoutDelay: number;
    duplicateReadDelay: number;
    enableVisitorMode: boolean;
    maxDailyScans: number;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    notifyOnAbsence: boolean;
    notifyOnLateArrival: boolean;
    notifyOnUnauthorizedAccess: boolean;
    notifyOnCapacityAlert: boolean;
    notifyOnSystemError: boolean;
    emailRecipients: string[];
    smsRecipients: string[];
  };
  security: {
    sessionTimeout: number;
    requireMFA: boolean;
    passwordExpiry: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    allowedIPs: string[];
  };
};

export type ReportRecord = {
  id: string;
  type: string;
  generatedAt: string;
  rows: number;
  generatedBy: string;
};

export type RfidDb = {
  students: Student[];
  tags: Tag[];
  scans: GateScan[];
  admins: AdminUser[];
  holidays: Holiday[];
  settings: Settings;
  reportHistory: ReportRecord[];
};

// ─────────────────────────────────────────
// GLOBAL SINGLETON (survives hot-reload)
// ─────────────────────────────────────────
declare global {
  // eslint-disable-next-line no-var
  var __rfidDb: RfidDb | undefined;
}

// ─────────────────────────────────────────
// SEED HELPERS
// ─────────────────────────────────────────
const FIRST = ["Aiden","Bianca","Caleb","Diana","Ethan","Faith","Gavin","Hannah","Ivan","Jade",
               "Karl","Luna","Marco","Nina","Oscar","Paula","Quinn","Rosa","Sam","Tina",
               "Uriel","Vera","Wayne","Xena","Yvan","Zara","Angelo","Bea","Carlo","Dina"];
const LAST  = ["Lopez","Reyes","Santos","Garcia","Cruz","Diaz","Tan","Lim","Flores","Lee",
               "Mendoza","Torres","Bautista","Castillo","Ramos","Aquino","Dela Cruz","Villanueva","Ocampo","Navarro"];

const GRADES: Record<StudentType, number[]> = {
  elementary: [1,2,3,4,5,6],
  highschool: [7,8,9,10],
  seniorhigh: [11,12],
  college:    [1,2,3,4],
};

const COLLEGES = [
  "College of Engineering","College of Computer Studies",
  "College of Arts and Sciences","College of Business Administration",
  "College of Education","College of Nursing",
];
const COURSES = [
  "BS Information Technology (BSIT)","BS Computer Science (BSCS)",
  "BS Civil Engineering (BSCE)","BS Business Administration (BSBA)",
  "Bachelor of Secondary Education (BSEd)","BS Nursing (BSN)",
  "BS Accountancy (BSA)","BS Psychology (BSPsych)",
];

function seedStudents(): Student[] {
  const types: StudentType[] = ["elementary","highschool","seniorhigh","college"];
  const now = Date.now();
  return Array.from({ length: 160 }, (_, i) => {
    const name      = `${FIRST[i % FIRST.length]} ${LAST[i % LAST.length]}`;
    const type      = types[i % types.length];
    const grade     = GRADES[type][i % GRADES[type].length];
    const isCollege = type === "college";
    return {
      id:          `s-${10000 + i}`,
      name,
      email:       `${name.replace(/\s+/g, ".").toLowerCase()}@students.school.edu`,
      studentType: type,
      grade,
      section:     isCollege ? null : ["A","B","C","D"][i % 4],
      college:     isCollege ? COLLEGES[i % COLLEGES.length] : null,
      course:      isCollege ? COURSES[i % COURSES.length]   : null,
      status:      (i % 12 === 0 ? "disabled" : "active") as "active" | "disabled",
      tagId:       `TAG-S-${3000 + i}`,
      lastSeen:    new Date(now - (i % 18) * 1_800_000).toISOString(),
      photoUrl:    `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
      createdAt:   new Date(now - i * 86_400_000).toISOString(),
    };
  });
}

function seedTags(students: Student[]): Tag[] {
  const now = Date.now();
  return students.map((s, i) => ({
    id:        `tag-${2000 + i}`,
    uid:       `UID-${(3000 + i).toString(16).toUpperCase()}`,
    status:    (s.status === "active" ? "assigned" : "disabled") as Tag["status"],
    type:      "student" as const,
    ownerId:   s.id,
    ownerName: s.name,
    issuedAt:  new Date(now - i * 86_400_000).toISOString(),
    revokedAt: null,
    lastSeen:  s.lastSeen,
  }));
}

function seedScans(students: Student[]): GateScan[] {
  const now    = Date.now();
  const active = students.filter(s => s.status === "active").slice(0, 40);
  const LMAP: Record<StudentType, string> = {
    elementary: "Elementary", highschool: "High School",
    seniorhigh: "Senior High", college: "College",
  };
  const scans: GateScan[] = [];
  active.forEach((s, i) => {
    scans.push({ id: `scan-in-${i}`,  studentId: s.id, studentName: s.name, level: LMAP[s.studentType], direction: "in",  time: new Date(now - (active.length - i) * 4 * 60_000).toISOString() });
    if (i % 3 === 0)
      scans.push({ id: `scan-out-${i}`, studentId: s.id, studentName: s.name, level: LMAP[s.studentType], direction: "out", time: new Date(now - (active.length - i) * 2 * 60_000).toISOString() });
  });
  return scans.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
}

function defaultSettings(): Settings {
  return {
    system:        { schoolName: "Benedicto College", timezone: "Asia/Manila", dateFormat: "MM/DD/YYYY", dataRetention: 365 },
    rfid:          { readerTimeout: 30, autoCheckout: true, checkoutDelay: 480, duplicateReadDelay: 5, enableVisitorMode: true, maxDailyScans: 100 },
    notifications: { emailNotifications: true, smsNotifications: false, pushNotifications: true, notifyOnAbsence: true, notifyOnLateArrival: true, notifyOnUnauthorizedAccess: true, notifyOnCapacityAlert: true, notifyOnSystemError: true, emailRecipients: ["admin@school.edu"], smsRecipients: [] },
    security:      { sessionTimeout: 60, requireMFA: false, passwordExpiry: 90, maxLoginAttempts: 5, lockoutDuration: 30, allowedIPs: [] },
  };
}

function createDb(): RfidDb {
  const students = seedStudents();
  return {
    students,
    tags:     seedTags(students),
    scans:    seedScans(students),
    admins: [
      { id: "admin-1", email: "admin@test.com",    password: "admin123",  name: "Super Admin",  role: "superadmin" },
      { id: "admin-2", email: "admin@school.edu",  password: "school123", name: "School Admin", role: "admin"      },
      { id: "admin-3", email: "viewer@school.edu", password: "view123",   name: "Viewer",       role: "viewer"     },
    ],
    holidays: [
      { id: "ph-1",  date: "2026-01-01", name: "New Year's Day",                     type: "regular" },
      { id: "ph-2",  date: "2026-02-25", name: "EDSA People Power Revolution",       type: "special" },
      { id: "ph-3",  date: "2026-04-02", name: "Maundy Thursday",                    type: "regular" },
      { id: "ph-4",  date: "2026-04-03", name: "Good Friday",                        type: "regular" },
      { id: "ph-5",  date: "2026-04-04", name: "Black Saturday",                     type: "special" },
      { id: "ph-6",  date: "2026-04-09", name: "Araw ng Kagitingan",                 type: "regular" },
      { id: "ph-7",  date: "2026-05-01", name: "Labor Day",                          type: "regular" },
      { id: "ph-8",  date: "2026-06-12", name: "Independence Day",                   type: "regular" },
      { id: "ph-9",  date: "2026-08-21", name: "Ninoy Aquino Day",                   type: "special" },
      { id: "ph-10", date: "2026-08-31", name: "National Heroes Day",                type: "regular" },
      { id: "ph-11", date: "2026-11-01", name: "All Saints' Day",                    type: "special" },
      { id: "ph-12", date: "2026-11-02", name: "All Souls' Day",                     type: "special" },
      { id: "ph-13", date: "2026-11-30", name: "Bonifacio Day",                      type: "regular" },
      { id: "ph-14", date: "2026-12-08", name: "Feast of the Immaculate Conception", type: "special" },
      { id: "ph-15", date: "2026-12-24", name: "Christmas Eve",                      type: "special" },
      { id: "ph-16", date: "2026-12-25", name: "Christmas Day",                      type: "regular" },
      { id: "ph-17", date: "2026-12-30", name: "Rizal Day",                          type: "regular" },
      { id: "ph-18", date: "2026-12-31", name: "New Year's Eve",                     type: "special" },
    ],
    settings:      defaultSettings(),
    reportHistory: [],
  };
}

// ─────────────────────────────────────────
// INIT + EXPORT
// ─────────────────────────────────────────
if (!global.__rfidDb) {
  global.__rfidDb = createDb();
}

export const db: RfidDb = global.__rfidDb;

export function nextId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
}

export function addScan(scan: GateScan): void {
  db.scans.unshift(scan);
  if (db.scans.length > 200) db.scans.length = 200;
}
