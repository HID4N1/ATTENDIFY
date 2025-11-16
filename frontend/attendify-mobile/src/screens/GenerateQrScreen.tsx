import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useCountdownContext } from '../contexts/CountdownContext';
import { generateQrData, stringifyQrData } from '../utils/qrHelpers';
import { createSession, updateSession } from '../services/SessionService';
import { formatTime } from '../utils/helpers';
import { DEFAULT_COUNTDOWN_DURATION } from '../utils/constants';

const GenerateQrScreen: React.FC = () => {
  const [qrData, setQrData] = useState<string | null>(null);
  const [classId, setClassId] = useState('');
  const [customDuration, setCustomDuration] = useState('');
  const { timeLeft, isActive, startCountdown, stopCountdown, addTime, setTime } = useCountdownContext();

  const generateQr = async () => {
    if (!classId.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un ID de classe');
      return;
    }

    try {
      const duration = customDuration ? parseInt(customDuration) * 60 : DEFAULT_COUNTDOWN_DURATION;
      const session = await createSession(classId, duration);
      const qr = generateQrData(session.id);
      setQrData(stringifyQrData(qr));
      startCountdown(duration, session.id);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer la session');
    }
  };

  const stopSession = async () => {
    if (qrData) {
      try {
        // Assuming we can extract sessionId from qrData or context
        // await updateSession(sessionId, { isActive: false });
        stopCountdown();
        setQrData(null);
      } catch (error) {
        Alert.alert('Erreur', 'Impossible d\'arrêter la session');
      }
    }
  };

  const addTimeToSession = () => {
    const minutes = parseInt(customDuration) || 5;
    addTime(minutes);
  };

  const setTimeForSession = () => {
    const minutes = parseInt(customDuration) || 10;
    setTime(minutes);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Générer QR Code</Text>

      <TextInput
        style={styles.input}
        placeholder="ID de classe"
        value={classId}
        onChangeText={setClassId}
      />

      <TextInput
        style={styles.input}
        placeholder="Durée personnalisée (minutes)"
        value={customDuration}
        onChangeText={setCustomDuration}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={generateQr}>
        <Text style={styles.buttonText}>Générer QR</Text>
      </TouchableOpacity>

      {qrData && (
        <View style={styles.qrContainer}>
          <QRCode value={qrData} size={200} />
          <Text style={styles.timer}>Temps restant: {formatTime(timeLeft)}</Text>
        </View>
      )}

      {isActive && (
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={addTimeToSession}>
            <Text style={styles.controlText}>Ajouter du temps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={setTimeForSession}>
            <Text style={styles.controlText}>Définir le temps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlButton, styles.stopButton]} onPress={stopSession}>
            <Text style={styles.controlText}>Arrêter</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  controlButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#dc3545',
  },
  controlText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default GenerateQrScreen;
