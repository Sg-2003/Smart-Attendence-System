import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getFaceEmbedding } from "@/lib/faceStore";

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { faceEmbedding } = body;

    if (!faceEmbedding || !Array.isArray(faceEmbedding)) {
      return NextResponse.json(
        { error: "Face embedding is required." },
        { status: 400 }
      );
    }

    let storedEmbedding: number[] | null = null;

    // Try DB first
    try {
      const faceProfile = await prisma.faceProfile.findUnique({
        where: { userId: session.user.id },
      });
      if (faceProfile) {
        storedEmbedding = JSON.parse(faceProfile.faceEmbedding);
      }
    } catch (dbErr) {
      console.warn("[FACE_VERIFY] DB unavailable, checking memory store");
    }

    // Fallback to shared memory store
    if (!storedEmbedding) {
      storedEmbedding = getFaceEmbedding(session.user.id);
    }

    // No registered face found at all
    if (!storedEmbedding) {
      return NextResponse.json(
        { error: "No face profile registered. Please register your face first.", matched: false },
        { status: 404 }
      );
    }

    // Compare the live embedding against the student's own stored profile
    const similarity = cosineSimilarity(faceEmbedding, storedEmbedding);
    const THRESHOLD = 0.82;
    const matched = similarity >= THRESHOLD;

    if (!matched) {
      return NextResponse.json(
        {
          error: "Face not recognized. This does not match your registered face profile.",
          similarity: Math.round(similarity * 100),
          matched: false,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      matched: true,
      similarity: Math.round(similarity * 100),
      message: "Face verified successfully — matches your registered profile.",
    });
  } catch (error) {
    console.error("[FACE_VERIFY]", error);
    return NextResponse.json({ error: "Face verification failed." }, { status: 500 });
  }
}
