import api from './api';

export interface Session {
  id: string;
  classId: string;
  startTime: string;
  duration: number;
  isActive: boolean;
}

export const createSession = async (classId: string, duration: number): Promise<Session> => {
  const response = await api.post('/sessions/', { class_id: classId, duration });
  return response.data;
};

export const getSessions = async (): Promise<Session[]> => {
  const response = await api.get('/sessions/');
  return response.data;
};

export const updateSession = async (sessionId: string, data: Partial<Session>): Promise<Session> => {
  const response = await api.patch(`/sessions/${sessionId}/`, data);
  return response.data;
};

export const getActiveSession = async (): Promise<Session | null> => {
  const response = await api.get('/sessions/active/');
  return response.data || null;
};
