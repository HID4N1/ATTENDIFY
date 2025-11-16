import api from './api';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  sessionId: string;
  status: 'present' | 'absent' | 'late';
  timestamp: string;
}

export class AttendanceService {
  static async markAttendance(sessionId: string, status: 'present' | 'absent' | 'late'): Promise<AttendanceRecord> {
    const response = await api.post('/attendance/', { session_id: sessionId, status });
    return response.data;
  }

  static async getAttendance(sessionId: string): Promise<AttendanceRecord[]> {
    const response = await api.get(`/attendance/?session_id=${sessionId}`);
    return response.data;
  }

  static async getStudentAttendance(studentId: string): Promise<AttendanceRecord[]> {
    const response = await api.get(`/attendance/?student_id=${studentId}`);
    return response.data;
  }

  static async updateAttendance(attendanceId: string, status: 'present' | 'absent' | 'late'): Promise<AttendanceRecord> {
    const response = await api.patch(`/attendance/${attendanceId}/`, { status });
    return response.data;
  }
}
