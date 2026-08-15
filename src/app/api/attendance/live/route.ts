import { NextRequest, NextResponse } from "next/server";
import { getLiveAttendeesForCourse } from "@/lib/attendanceStore";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId") || undefined;

    const attendees = getLiveAttendeesForCourse(courseId);

    return NextResponse.json({
      success: true,
      count: attendees.length,
      attendees,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[ATTENDANCE_LIVE_GET]", error);
    return NextResponse.json({ error: "Failed to fetch live stream." }, { status: 500 });
  }
}
