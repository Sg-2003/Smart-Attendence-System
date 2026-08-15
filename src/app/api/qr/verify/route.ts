import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getQRSession } from "@/lib/qrStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Session ID is required." },
        { status: 400 }
      );
    }

    // Try DB first
    try {
      const qrSession = await prisma.qRSession.findUnique({
        where: { id: sessionId },
        include: { course: { select: { id: true, name: true } } },
      });

      if (!qrSession) {
        // Fall through to memory check below
        throw new Error("Not found in DB");
      }

      if (new Date() > qrSession.expiresAt) {
        return NextResponse.json(
          { error: "This QR session has expired. Ask your faculty to generate a new one." },
          { status: 410 }
        );
      }

      return NextResponse.json({
        valid: true,
        courseId: qrSession.courseId,
        courseName: qrSession.course?.name ?? "Unknown Course",
        expiresAt: qrSession.expiresAt.toISOString(),
      });
    } catch (dbErr) {
      // Check memory store
      const memSession = getQRSession(sessionId);

      if (!memSession) {
        return NextResponse.json(
          { error: "Invalid or expired QR session." },
          { status: 404 }
        );
      }

      if (new Date() > memSession.expiresAt) {
        return NextResponse.json(
          { error: "This QR session has expired. Ask your faculty to generate a new one." },
          { status: 410 }
        );
      }

      return NextResponse.json({
        valid: true,
        courseId: memSession.courseId,
        courseName: "Course Session",
        expiresAt: memSession.expiresAt.toISOString(),
      });
    }
  } catch (error) {
    console.error("[QR_VERIFY]", error);
    return NextResponse.json({ error: "Failed to verify QR session." }, { status: 500 });
  }
}
