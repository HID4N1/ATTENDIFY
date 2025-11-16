import { Alert } from 'react-native';

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const showAlert = (title: string, message: string) => {
  Alert.alert(title, message);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateRandomId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const camelCaseToSnakeCase = (value: string): string => {
  return value.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
};
