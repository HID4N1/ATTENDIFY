import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useCountdownContext } from '../contexts/CountdownContext';
import { parseQrData, validateQrData } from '../utils/qrHelpers';
import { AttendanceService } from '../services/AttendanceService';
import { showAlert } from '../utils/helpers';

const ScanQrScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const { isActive, sessionId } = useCountdownContext();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    const qrData = parseQrData(data);
    if (!qrData || !validateQrData(qrData)) {
      showAlert('Erreur', 'QR code invalide ou expiré');
      setScanned(false);
      return;
    }

    if (!isActive || !sessionId) {
      showAlert('Erreur', 'Aucune session active');
      setScanned(false);
      return;
    }

    try {
      await AttendanceService.markAttendance(qrData.sessionId, 'present');
      showAlert('Succès', 'Présence enregistrée');
    } catch (error) {
      showAlert('Erreur', 'Impossible d\'enregistrer la présence');
    }

    setScanned(false);
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Demande de permission caméra...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>Accès caméra refusé</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanner le QR Code</Text>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scanned && (
        <TouchableOpacity style={styles.rescanButton} onPress={() => setScanned(false)}>
          <Text style={styles.rescanText}>Scanner à nouveau</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  camera: {
    width: '80%',
    height: '60%',
  },
  rescanButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  rescanText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ScanQrScreen;
