import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { createQRSchema } from "@/lib/validations";
import crypto from "crypto";
import { createQRSession } from "@/lib/qrStore";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createQRSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { courseId, expiryMinutes } = parsed.data;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Generate a cryptographically secure unique code
    const code = crypto.randomBytes(24).toString("hex");

    // Try DB first
    try {
      const qrSession = await prisma.qRSession.create({
        data: {
          code,
          courseId,
          expiresAt,
          createdById: session.user.id,
        },
      });

      return NextResponse.json({
        sessionId: qrSession.id,
        code: qrSession.code,
        expiresAt: qrSession.expiresAt.toISOString(),
        expiryMinutes,
      }, { status: 201 });
    } catch (dbErr) {
      console.warn("[QR_CREATE] DB unavailable, using memory fallback");

      const sessionId = `qr_${Date.now()}_${crypto.randomBytes(8).toString("hex")}`;
      createQRSession({
        id: sessionId,
        code,
        courseId,
        expiresAt,
        createdById: session.user.id,
      });

      return NextResponse.json({
        sessionId,
        code,
        expiresAt: expiresAt.toISOString(),
        expiryMinutes,
      }, { status: 201 });
    }
  } catch (error) {
    console.error("[QR_CREATE]", error);
    return NextResponse.json({ error: "Failed to create QR session." }, { status: 500 });
  }
}
