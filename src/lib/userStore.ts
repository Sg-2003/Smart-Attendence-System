import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  altPasswords?: string[];
  role: "STUDENT" | "FACULTY" | "ADMIN";
  department?: string | null;
  semester?: number | null;
}

// In-memory store initialized with pre-hashed passwords for demo accounts
const studentHash1 = bcrypt.hashSync("student123", 10);
const studentHash2 = bcrypt.hashSync("Student@1234", 10);

const facultyHash1 = bcrypt.hashSync("faculty123", 10);
const facultyHash2 = bcrypt.hashSync("Faculty@1234", 10);

const adminHash1 = bcrypt.hashSync("admin123", 10);
const adminHash2 = bcrypt.hashSync("Admin@1234", 10);

const memoryUsers: SystemUser[] = [
  // Student Accounts
  {
    id: "demo-student-1",
    name: "Alex Johnson",
    email: "student@attendai.com",
    password: studentHash1,
    altPasswords: [studentHash2],
    role: "STUDENT",
    department: "Computer Science",
    semester: 4,
  },
  {
    id: "demo-student-2",
    name: "Alex Johnson",
    email: "student@attendai.pro",
    password: studentHash2,
    altPasswords: [studentHash1],
    role: "STUDENT",
    department: "Computer Science",
    semester: 4,
  },
  // Faculty Accounts
  {
    id: "demo-faculty-1",
    name: "Dr. Amit Gupta",
    email: "faculty@attendai.com",
    password: facultyHash1,
    altPasswords: [facultyHash2],
    role: "FACULTY",
    department: "Computer Science",
  },
  {
    id: "demo-faculty-2",
    name: "Dr. Amit Gupta",
    email: "faculty@attendai.pro",
    password: facultyHash2,
    altPasswords: [facultyHash1],
    role: "FACULTY",
    department: "Computer Science",
  },
  // Admin Accounts
  {
    id: "demo-admin-1",
    name: "System Admin",
    email: "admin@attendai.com",
    password: adminHash1,
    altPasswords: [adminHash2],
    role: "ADMIN",
    department: "Administration",
  },
  {
    id: "demo-admin-2",
    name: "System Admin",
    email: "admin@attendai.pro",
    password: adminHash2,
    altPasswords: [adminHash1],
    role: "ADMIN",
    department: "Administration",
  },
];

export async function findUserByEmail(email: string): Promise<SystemUser | null> {
  const normalizedEmail = email.trim().toLowerCase();

  // Try DB first
  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (dbUser) {
      return {
        id: dbUser.id,
        name: dbUser.name ?? "User",
        email: dbUser.email ?? normalizedEmail,
        password: dbUser.password ?? undefined,
        role: dbUser.role as "STUDENT" | "FACULTY" | "ADMIN",
        department: dbUser.department,
        semester: dbUser.semester,
      };
    }
  } catch (err) {
    console.warn("[USER_STORE] Database lookup failed, falling back to memory store:", err);
  }

  // Fallback to memory store
  const found = memoryUsers.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );
  return found ?? null;
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "FACULTY";
  department?: string;
  semester?: number;
}): Promise<SystemUser> {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const normalizedEmail = data.email.trim().toLowerCase();

  // Try DB first
  try {
    const dbUser = await prisma.user.create({
      data: {
        name: data.name,
        email: normalizedEmail,
        password: hashedPassword,
        role: data.role,
        department: data.department || null,
        semester: data.semester || null,
      },
    });
    return {
      id: dbUser.id,
      name: dbUser.name ?? data.name,
      email: dbUser.email ?? normalizedEmail,
      role: dbUser.role as "STUDENT" | "FACULTY" | "ADMIN",
      department: dbUser.department,
      semester: dbUser.semester,
    };
  } catch (err) {
    console.warn("[USER_STORE] Database create failed, saving to memory store:", err);
  }

  // Fallback to memory store
  const newUser: SystemUser = {
    id: `mem-${Date.now()}`,
    name: data.name,
    email: normalizedEmail,
    password: hashedPassword,
    role: data.role,
    department: data.department || null,
    semester: data.semester || null,
  };
  memoryUsers.push(newUser);
  return newUser;
}
