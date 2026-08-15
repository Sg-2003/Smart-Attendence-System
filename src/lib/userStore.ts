import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "STUDENT" | "FACULTY" | "ADMIN";
  department?: string | null;
  semester?: number | null;
}

// In-memory store initialized with pre-hashed passwords for demo accounts
const defaultHashedPassword = bcrypt.hashSync("Student@1234", 10);
const facultyHashedPassword = bcrypt.hashSync("Faculty@1234", 10);
const adminHashedPassword = bcrypt.hashSync("Admin@1234", 10);

const memoryUsers: SystemUser[] = [
  {
    id: "demo-student-1",
    name: "Alex Johnson",
    email: "student@attendai.pro",
    password: defaultHashedPassword,
    role: "STUDENT",
    department: "Computer Science",
    semester: 4,
  },
  {
    id: "demo-faculty-1",
    name: "Dr. Amit Gupta",
    email: "faculty@attendai.pro",
    password: facultyHashedPassword,
    role: "FACULTY",
    department: "Computer Science",
  },
  {
    id: "demo-admin-1",
    name: "System Admin",
    email: "admin@attendai.pro",
    password: adminHashedPassword,
    role: "ADMIN",
    department: "Administration",
  },
];

export async function findUserByEmail(email: string): Promise<SystemUser | null> {
  // Try DB first
  try {
    const dbUser = await prisma.user.findUnique({
      where: { email },
    });
    if (dbUser) {
      return {
        id: dbUser.id,
        name: dbUser.name ?? "User",
        email: dbUser.email ?? email,
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
    (u) => u.email.toLowerCase() === email.toLowerCase()
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

  // Try DB first
  try {
    const dbUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        department: data.department || null,
        semester: data.semester || null,
      },
    });
    return {
      id: dbUser.id,
      name: dbUser.name ?? data.name,
      email: dbUser.email ?? data.email,
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
    email: data.email,
    password: hashedPassword,
    role: data.role,
    department: data.department || null,
    semester: data.semester || null,
  };
  memoryUsers.push(newUser);
  return newUser;
}
