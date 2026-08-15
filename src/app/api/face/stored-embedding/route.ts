import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getFaceEmbedding } from "@/lib/faceStore";

/**
 * GET /api/face/stored-embedding
 * Returns the current user's stored face embedding for client-side demo matching.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try DB first
    try {
      const faceProfile = await prisma.faceProfile.findUnique({
        where: { userId: session.user.id },
      });
      if (faceProfile) {
        return NextResponse.json({
          embedding: JSON.parse(faceProfile.faceEmbedding),
        });
      }
    } catch {
      // DB unavailable
    }

    // Fallback to memory store
    const memEmbedding = getFaceEmbedding(session.user.id);
    if (memEmbedding) {
      return NextResponse.json({ embedding: memEmbedding });
    }

    return NextResponse.json({ embedding: null }, { status: 404 });
  } catch (error) {
    console.error("[FACE_STORED_EMBEDDING]", error);
    return NextResponse.json({ error: "Failed to fetch stored embedding." }, { status: 500 });
  }
}
