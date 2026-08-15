/**
 * Shared in-memory face embedding store.
 * Used as a fallback when the database is unavailable.
 * Both register and verify routes import from here so they share state.
 */

const memoryFaceEmbeddings = new Map<string, number[]>();

export function setFaceEmbedding(userId: string, embedding: number[]) {
  memoryFaceEmbeddings.set(userId, embedding);
}

export function getFaceEmbedding(userId: string): number[] | null {
  return memoryFaceEmbeddings.get(userId) ?? null;
}

export function hasFaceEmbedding(userId: string): boolean {
  return memoryFaceEmbeddings.has(userId);
}
