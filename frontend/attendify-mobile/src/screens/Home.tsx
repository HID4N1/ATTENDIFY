import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCountdownContext } from '../contexts/CountdownContext';
import { formatTime } from '../utils/helpers';

const Home: React.FC = ({ navigation }: any) => {
  const { timeLeft, isActive } = useCountdownContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendify</Text>
      <Text style={styles.subtitle}>Gestion des présences</Text>

      {isActive && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>Session active - Temps restant:</Text>
          <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GenerateQr')}>
        <Text style={styles.buttonText}>Générer QR Code</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ScanQr')}>
        <Text style={styles.buttonText}>Scanner QR Code</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AttendanceList')}>
        <Text style={styles.buttonText}>Voir les présences</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Sessions')}>
        <Text style={styles.buttonText}>Sessions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.buttonText}>Profil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  timerContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 16,
    color: '#1976d2',
  },
  timerValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
