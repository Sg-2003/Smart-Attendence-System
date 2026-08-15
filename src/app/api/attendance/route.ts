import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { markAttendanceSchema } from "@/lib/validations";
import { addAttendanceRecord, getAllAttendanceRecords, initialCourses } from "@/lib/attendanceStore";

// ── POST /api/attendance — Mark Attendance ────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = markAttendanceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { courseId, method, location } = parsed.data;
    const studentId = session.user.id;
    const courseName = initialCourses.find((c) => c.id === courseId)?.name || courseId;

    // Record in dynamic store
    const record = addAttendanceRecord({
      studentId,
      studentName: session.user.name || "Student User",
      courseId,
      courseName,
      method,
      status: "PRESENT",
      location: location || null,
      date: "Today",
    });

    // Try DB first
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      await prisma.attendance.create({
        data: {
          studentId,
          courseId,
          method,
          status: "PRESENT",
          location: location || null,
          date: new Date(),
          time: new Date(),
        },
      });
    } catch (dbErr) {
      console.warn("[ATTENDANCE_POST] DB unavailable, saved to dynamic memory store");
    }

    return NextResponse.json(
      { message: "Attendance marked successfully.", attendanceId: record.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[ATTENDANCE_POST]", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// ── GET /api/attendance — Fetch Attendance ────────────────────────────────────
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const records = await prisma.attendance.findMany({
        orderBy: { date: "desc" },
        take: 50,
      });
      if (records && records.length > 0) {
        return NextResponse.json({ records });
      }
    } catch (dbErr) {}

    return NextResponse.json({ records: getAllAttendanceRecords(session.user.id) });
  } catch (error) {
    console.error("[ATTENDANCE_GET]", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
