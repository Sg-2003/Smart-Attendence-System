import { create } from "zustand";

interface AttendanceState {
  activeCourseId: string | null;
  activeSessionId: string | null;
  gpsLocation: { lat: number; lng: number } | null;
  setActiveCourseId: (id: string | null) => void;
  setActiveSessionId: (id: string | null) => void;
  setGpsLocation: (loc: { lat: number; lng: number } | null) => void;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  activeCourseId: null,
  activeSessionId: null,
  gpsLocation: null,
  setActiveCourseId: (id) => set({ activeCourseId: id }),
  setActiveSessionId: (id) => set({ activeSessionId: id }),
  setGpsLocation: (loc) => set({ gpsLocation: loc }),
}));
