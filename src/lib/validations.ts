import { z } from "zod";

// ── Auth ────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["STUDENT", "FACULTY"]),
    department: z.string().optional(),
    semester: z.number().min(1).max(8).optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterFormData = z.infer<typeof registerSchema>;

// ── Attendance ──────────────────────────────────────────────────────────────
export const markAttendanceSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  method: z.enum(["FACE", "QR", "MANUAL"]),
  qrCode: z.string().optional(),
  faceEmbedding: z.array(z.number()).optional(),
  location: z.string().optional(), // "lat,lng"
});
export type MarkAttendanceData = z.infer<typeof markAttendanceSchema>;

// ── Course ──────────────────────────────────────────────────────────────────
export const courseSchema = z.object({
  name: z.string().min(2, "Course name is required"),
  department: z.string().min(1, "Department is required"),
  semester: z.coerce.number().min(1).max(8),
  teacherId: z.string().optional(),
});
export type CourseFormData = z.infer<typeof courseSchema>;

// ── QR Session ──────────────────────────────────────────────────────────────
export const createQRSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  expiryMinutes: z.coerce.number().min(1).max(60).default(5),
});
export type CreateQRData = z.infer<typeof createQRSchema>;

// ── Department ──────────────────────────────────────────────────────────────
export const departmentSchema = z.object({
  name: z.string().min(2, "Department name is required"),
  code: z.string().min(2, "Department code is required"),
});
export type DepartmentFormData = z.infer<typeof departmentSchema>;
