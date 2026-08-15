/**
 * Dynamic Attendance Store
 * Manages live attendance records, course progress, and real-time student statistics.
 */

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  courseId: string;
  courseName: string;
  method: "QR" | "FACE" | "MANUAL";
  status: "PRESENT" | "LATE" | "ABSENT";
  location?: string | null;
  date: string;
  time: string;
}

export interface CourseProgress {
  id: string;
  code: string;
  name: string;
  faculty: string;
  credits: number;
  time: string;
  room: string;
  baseAttended: number;
  baseTotal: number;
  attended: number;
  total: number;
  attendanceRate: number;
  status: "Good" | "Low";
  isTodayAttended: boolean;
}

// Initial baseline courses and attendance
export const initialCourses: Omit<CourseProgress, "attended" | "total" | "attendanceRate" | "status" | "isTodayAttended">[] = [
  {
    id: "c1",
    code: "CS301",
    name: "Data Structures & Algorithms",
    faculty: "Dr. Amit Gupta",
    credits: 4,
    time: "09:00 AM",
    room: "CS-201",
    baseAttended: 22,
    baseTotal: 25,
  },
  {
    id: "c2",
    code: "CS302",
    name: "Database Management System",
    faculty: "Prof. Sneha Reddy",
    credits: 4,
    time: "11:00 AM",
    room: "CS-102",
    baseAttended: 21,
    baseTotal: 25,
  },
  {
    id: "c3",
    code: "CS303",
    name: "Computer Networks",
    faculty: "Dr. Vikram Singh",
    credits: 3,
    time: "02:00 PM",
    room: "CS-301",
    baseAttended: 13,
    baseTotal: 20,
  },
  {
    id: "c4",
    code: "CS304",
    name: "Operating Systems",
    faculty: "Prof. Meera Iyer",
    credits: 4,
    time: "04:00 PM",
    room: "CS-204",
    baseAttended: 18,
    baseTotal: 20,
  },
];

// Baseline recent attendance list
const initialRecentAttendance: AttendanceRecord[] = [
  {
    id: "rec-1",
    studentId: "demo-1",
    studentName: "Ananya Singh",
    rollNo: "CS2024001",
    courseId: "c1",
    courseName: "Data Structures & Algorithms",
    method: "QR",
    status: "PRESENT",
    date: "Today",
    time: "09:02 AM",
  },
  {
    id: "rec-2",
    studentId: "demo-2",
    studentName: "Rahul Verma",
    rollNo: "CS2024002",
    courseId: "c1",
    courseName: "Data Structures & Algorithms",
    method: "FACE",
    status: "PRESENT",
    date: "Today",
    time: "09:04 AM",
  },
  {
    id: "rec-3",
    studentId: "demo-3",
    studentName: "Priya Sharma",
    rollNo: "CS2024003",
    courseId: "c2",
    courseName: "Database Management System",
    method: "QR",
    status: "PRESENT",
    date: "Today",
    time: "11:02 AM",
  },
  {
    id: "rec-4",
    studentId: "demo-4",
    studentName: "Arjun Mehta",
    rollNo: "CS2024004",
    courseId: "c3",
    courseName: "Computer Networks",
    method: "QR",
    status: "PRESENT",
    date: "Yesterday",
    time: "02:05 PM",
  },
];

// Global in-memory storage for attendance records
const attendanceRecords: AttendanceRecord[] = [...initialRecentAttendance];

export function addAttendanceRecord(
  record: Omit<AttendanceRecord, "id" | "time" | "studentName" | "rollNo"> & {
    time?: string;
    studentName?: string;
    rollNo?: string;
  }
): AttendanceRecord {
  const newRecord: AttendanceRecord = {
    ...record,
    id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    studentName: record.studentName || "Current Student",
    rollNo: record.rollNo || `CS2024${Math.floor(100 + Math.random() * 900)}`,
    time: record.time || new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
  attendanceRecords.unshift(newRecord);
  return newRecord;
}

export function getAllAttendanceRecords(studentId?: string): AttendanceRecord[] {
  if (!studentId) return attendanceRecords;
  return attendanceRecords.filter((r) => r.studentId === studentId || r.studentId.startsWith("demo-"));
}

export function getLiveAttendeesForCourse(courseId?: string): AttendanceRecord[] {
  if (!courseId) return attendanceRecords;
  return attendanceRecords.filter((r) => r.courseId === courseId || r.courseName.toLowerCase().includes(courseId.toLowerCase()));
}

export function getStudentCoursesProgress(studentId?: string): CourseProgress[] {
  const records = getAllAttendanceRecords(studentId);

  return initialCourses.map((c) => {
    const newAttended = records.filter(
      (r) => (r.courseId === c.id || r.courseName === c.name) && r.status === "PRESENT" && r.id.startsWith("att_")
    ).length;

    const isTodayAttended = records.some(
      (r) => (r.courseId === c.id || r.courseName === c.name) && r.status === "PRESENT" && (r.date === "Today" || r.id.startsWith("att_"))
    );

    const attended = c.baseAttended + newAttended;
    const total = c.baseTotal + newAttended;
    const attendanceRate = total > 0 ? Math.round((attended / total) * 100) : 0;
    const status: "Good" | "Low" = attendanceRate >= 75 ? "Good" : "Low";

    return {
      ...c,
      attended,
      total,
      attendanceRate,
      status,
      isTodayAttended,
    };
  });
}

export function getStudentDashboardMetrics(studentId?: string) {
  const courses = getStudentCoursesProgress(studentId);
  const records = getAllAttendanceRecords(studentId);

  const totalAttended = courses.reduce((acc, curr) => acc + curr.attended, 0);
  const totalClasses = courses.reduce((acc, curr) => acc + curr.total, 0);
  const overallRate = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;
  const totalAbsences = totalClasses - totalAttended;

  // Today's classes schedule
  const schedule = courses.map((c) => ({
    id: c.id,
    course: c.name,
    time: c.time,
    room: c.room,
    faculty: c.faculty,
    status: c.isTodayAttended ? ("attended" as const) : ("upcoming" as const),
  }));

  // Weekly attendance chart
  const weeklyData = [
    { day: "Mon", present: 4, total: 4 },
    { day: "Tue", present: 3, total: 4 },
    { day: "Wed", present: 4, total: 4 },
    { day: "Thu", present: 3, total: 4 },
    { day: "Fri", present: Math.min(4, 3 + (records.some((r) => r.id.startsWith("att_")) ? 1 : 0)), total: 4 },
  ];

  return {
    overallRate: `${overallRate}%`,
    totalAttendedCombined: `${totalAttended}/${totalClasses}`,
    totalAbsences,
    classesToday: schedule.length,
    schedule,
    recentAttendance: records.slice(0, 8),
    weeklyData,
    courses,
  };
}
