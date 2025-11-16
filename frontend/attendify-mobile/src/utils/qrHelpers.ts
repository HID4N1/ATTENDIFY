import CryptoJS from 'crypto-js';

const SECRET_KEY = 'attendify-secret-key'; // In production, use a secure key from env

export interface QrData {
  sessionId: string;
  timestamp: number;
  hash: string;
}

export const generateQrData = (sessionId: string): QrData => {
  const timestamp = Date.now();
  const data = `${sessionId}:${timestamp}`;
  const hash = CryptoJS.HmacSHA256(data, SECRET_KEY).toString();
  return { sessionId, timestamp, hash };
};

export const validateQrData = (qrData: QrData): boolean => {
  const { sessionId, timestamp, hash } = qrData;
  const data = `${sessionId}:${timestamp}`;
  const expectedHash = CryptoJS.HmacSHA256(data, SECRET_KEY).toString();
  return hash === expectedHash && (Date.now() - timestamp) < 24 * 60 * 60 * 1000; // Valid for 24 hours
};

export const parseQrData = (qrString: string): QrData | null => {
  try {
    const parsed = JSON.parse(qrString);
    if (parsed.sessionId && parsed.timestamp && parsed.hash) {
      return parsed as QrData;
    }
  } catch (error) {
    console.error('Invalid QR data format', error);
  }
  return null;
};

export const stringifyQrData = (qrData: QrData): string => {
  return JSON.stringify(qrData);
};
