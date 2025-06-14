import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string;
  currentMedications: string;
  primaryPhysician: string;
  emergencyContact: string;
  emergencyPhone: string;
}

type PersonalInformationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PersonalInformation'>;
};

const PersonalInformationScreen: React.FC<PersonalInformationScreenProps> = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    dateOfBirth: '',
    bloodType: '',
    allergies: 'None',
    currentMedications: 'None',
    primaryPhysician: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  useEffect(() => {
    loadPersonalInfo();
  }, []);

  const loadPersonalInfo = async () => {
    try {
      const data = await AsyncStorage.getItem('currentUser');
      if (data) {
        setPersonalInfo({ ...personalInfo, ...JSON.parse(data) });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load personal information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!personalInfo.fullName) {
      Alert.alert('Error', 'Full name is required');
      return;
    }

    setIsSaving(true);
    try {
      await AsyncStorage.setItem('currentUser', JSON.stringify(personalInfo));
      setIsEditing(false);
      Alert.alert('Success', 'Personal information updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#FF0000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Information</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Ionicons
            name={isEditing ? "checkmark" : "create-outline"}
            size={24}
            color="#FF0000"
            onPress={isEditing ? handleSave : undefined}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={personalInfo.fullName}
                onChangeText={(text) => setPersonalInfo({ ...personalInfo, fullName: text })}
                editable={isEditing}
                placeholder="Enter your full name"
              />
            ) : (
              <Text style={styles.valueText}>{personalInfo.fullName || 'Not provided'}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={personalInfo.dateOfBirth}
                onChangeText={(text) => setPersonalInfo({ ...personalInfo, dateOfBirth: text })}
                editable={isEditing}
                placeholder="YYYY-MM-DD"
                keyboardType="numbers-and-punctuation"
              />
            ) : (
              <Text style={styles.valueText}>{personalInfo.dateOfBirth || 'Not provided'}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Blood Type</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={personalInfo.bloodType}
                onChangeText={(text) => setPersonalInfo({ ...personalInfo, bloodType: text })}
                editable={isEditing}
                placeholder="Enter your blood type"
              />
            ) : (
              <Text style={styles.valueText}>{personalInfo.bloodType || 'Not provided'}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Allergies</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea, !isEditing && styles.inputDisabled]}
                value={personalInfo.allergies}
                onChangeText={(text) => setPersonalInfo({ ...personalInfo, allergies: text })}
                editable={isEditing}
                multiline
                numberOfLines={4}
                placeholder="List any allergies"
              />
            ) : (
              <Text style={styles.valueText}>{personalInfo.allergies || 'Not provided'}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Medical Conditions</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea, !isEditing && styles.inputDisabled]}
                value={personalInfo.medicalConditions}
                onChangeText={(text) => setPersonalInfo({ ...personalInfo, medicalConditions: text })}
                editable={isEditing}
                multiline
                numberOfLines={4}
                placeholder="List any medical conditions"
              />
            ) : (
              <Text style={styles.valueText}>{personalInfo.medicalConditions || 'Not provided'}</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {isEditing && (
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background
    paddingBottom: 90,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', // Black background for loading container
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1A1A1A', // Dark background for header
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Add shadow for header
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF0000', // Red text for header title
    textShadowColor: '#333333',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2, // Add text shadow for header title
  },
  backButton: {
    padding: 8,
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
    backgroundColor: '#1A1A1A', // Add background for sections
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Add shadow for sections
  },
  inputGroup: {
    marginBottom: 12, // Reduced margin for compact spacing
  },
  label: {
    fontSize: 14, // Slightly smaller font size for labels
    color: '#CCCCCC', // Light gray text for labels
    marginBottom: 4, // Reduced margin for compact spacing
  },
  input: {
    backgroundColor: '#1A1A1A', // Dark background for input fields
    borderRadius: 8,
    padding: 10, // Reduced padding for compact spacing
    fontSize: 14, // Slightly smaller font size for input text
    borderWidth: 1,
    borderColor: '#333333',
    color: '#FFFFFF', // White text for input fields
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2, // Add shadow for input fields
  },
  inputDisabled: {
    backgroundColor: '#333333', // Darker background for disabled input fields
    color: '#666666', // Gray text for disabled input fields
  },
  textArea: {
    height: 80, // Reduced height for text areas
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#FF0000', // Red background for save button
    margin: 16,
    padding: 12, // Reduced padding for compact spacing
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Add shadow for save button
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFFFFF', // White text for save button
    fontSize: 14, // Slightly smaller font size for button text
    fontWeight: 'bold',
  },
  valueText: {
    fontSize: 16,
    color: '#FFFFFF', // White text for displayed values
    marginBottom: 8,
  },
});

export default PersonalInformationScreen;