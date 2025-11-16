import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { AttendanceService, AttendanceRecord } from '../services/AttendanceService';
import { formatTime } from '../utils/helpers';

const AttendanceListScreen: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  useEffect(() => {
    loadAttendance();
  }, [selectedSession]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const records = selectedSession
        ? await AttendanceService.getAttendance(selectedSession)
        : await AttendanceService.getStudentAttendance('current_student_id'); // Replace with actual student ID
      setAttendanceRecords(records);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger la liste de présence');
    } finally {
      setLoading(false);
    }
  };

  const updateAttendanceStatus = async (recordId: string, status: 'present' | 'absent' | 'late') => {
    try {
      await AttendanceService.updateAttendance(recordId, status);
      loadAttendance(); // Refresh the list
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour la présence');
    }
  };

  const renderAttendanceItem = ({ item }: { item: AttendanceRecord }) => (
    <View style={styles.attendanceItem}>
      <Text style={styles.studentName}>Étudiant: {item.studentId}</Text>
      <Text style={styles.sessionInfo}>Session: {item.sessionId}</Text>
      <Text style={styles.timestamp}>Heure: {new Date(item.timestamp).toLocaleString()}</Text>
      <Text style={[styles.status, getStatusStyle(item.status)]}>Statut: {item.status}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.presentButton]}
          onPress={() => updateAttendanceStatus(item.id, 'present')}
        >
          <Text style={styles.actionText}>Présent</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.absentButton]}
          onPress={() => updateAttendanceStatus(item.id, 'absent')}
        >
          <Text style={styles.actionText}>Absent</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.lateButton]}
          onPress={() => updateAttendanceStatus(item.id, 'late')}
        >
          <Text style={styles.actionText}>En retard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'present':
        return styles.statusPresent;
      case 'absent':
        return styles.statusAbsent;
      case 'late':
        return styles.statusLate;
      default:
        return {};
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste de Présence</Text>
      <FlatList
        data={attendanceRecords}
        renderItem={renderAttendanceItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucune présence enregistrée</Text>}
      />
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
  attendanceItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sessionInfo: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusPresent: {
    color: '#28a745',
  },
  statusAbsent: {
    color: '#dc3545',
  },
  statusLate: {
    color: '#ffc107',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 8,
    borderRadius: 5,
    minWidth: 70,
    alignItems: 'center',
  },
  presentButton: {
    backgroundColor: '#28a745',
  },
  absentButton: {
    backgroundColor: '#dc3545',
  },
  lateButton: {
    backgroundColor: '#ffc107',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6c757d',
    marginTop: 50,
  },
});

export default AttendanceListScreen;
