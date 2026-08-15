import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { setFaceEmbedding, hasFaceEmbedding } from "@/lib/faceStore";

// ── GET /api/face/register — Check if face profile exists ─────────────────────
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check DB first
    try {
      const faceProfile = await prisma.faceProfile.findUnique({
        where: { userId: session.user.id },
        select: { verified: true, updatedAt: true },
      });

      if (faceProfile) {
        return NextResponse.json({
          registered: true,
          verified: faceProfile.verified,
          updatedAt: faceProfile.updatedAt?.toISOString() ?? null,
        });
      }
    } catch {
      // DB unavailable, check memory
    }

    // Fallback: check memory store
    if (hasFaceEmbedding(session.user.id)) {
      return NextResponse.json({
        registered: true,
        verified: true,
        updatedAt: null,
      });
    }

    return NextResponse.json({ registered: false });
  } catch (error) {
    console.error("[FACE_STATUS]", error);
    return NextResponse.json({ error: "Failed to check face status." }, { status: 500 });
  }
}

// ── POST /api/face/register — Register face profile ──────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { faceEmbedding } = body;

    if (!faceEmbedding || !Array.isArray(faceEmbedding) || faceEmbedding.length < 50) {
      return NextResponse.json(
        { error: "Invalid face embedding. Please capture your face again." },
        { status: 400 }
      );
    }

    // Always save to memory store (works as fallback and for demo)
    setFaceEmbedding(session.user.id, faceEmbedding);

    // Also try DB
    try {
      await prisma.faceProfile.upsert({
        where: { userId: session.user.id },
        update: {
          faceEmbedding: JSON.stringify(faceEmbedding),
          verified: true,
          updatedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          faceEmbedding: JSON.stringify(faceEmbedding),
          verified: true,
        },
      });
    } catch (dbErr) {
      console.warn("[FACE_REGISTER] DB unavailable, saved to memory fallback");
    }

    return NextResponse.json(
      { message: "Face profile registered successfully.", verified: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FACE_REGISTER]", error);
    return NextResponse.json({ error: "Failed to register face profile." }, { status: 500 });
  }
}
