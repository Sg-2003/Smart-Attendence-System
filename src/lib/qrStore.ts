/**
 * Shared in-memory QR session store.
 * Used as a fallback when the database is unavailable.
 */

export interface MemoryQRSession {
  id: string;
  code: string;
  courseId: string;
  expiresAt: Date;
  createdById: string;
}

const memoryQRSessions = new Map<string, MemoryQRSession>();

export function createQRSession(session: MemoryQRSession) {
  memoryQRSessions.set(session.id, session);
}

export function getQRSession(sessionId: string): MemoryQRSession | null {
  return memoryQRSessions.get(sessionId) ?? null;
}

export function getQRSessionByCode(code: string): MemoryQRSession | null {
  for (const session of memoryQRSessions.values()) {
    if (session.code === code) return session;
  }
  return null;
}
