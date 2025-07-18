// crisis-frontend/app/help-form.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For the map icon

// **IMPORTANT: Replace with your backend's IP address and port.**
// If running backend on your machine, find your local IPv4 address (e.g., 192.168.1.X)
// Use 'localhost' or '127.0.0.1' if using an Android emulator configured for host machine access.
// Otherwise, use your machine's IP. After deployment, use the Render URL.
const API_BASE_URL = 'http://192.168.1.5:5000/api/help'; // EXAMPLE IP. Update this!

export default function HelpFormScreen() {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null); // { lat, lng }
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Location Permission Denied', 'Please enable location services for this app to auto-detect your position.');
        return;
      }

      setLoading(true);
      try {
        let currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation({
          lat: currentLocation.coords.latitude,
          lng: currentLocation.coords.longitude,
        });
        setErrorMsg('');
      } catch (error) {
        console.error("Error fetching location:", error);
        setErrorMsg('Could not fetch location automatically. Please try again or provide details in description.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!description || !location) {
      Alert.alert('Missing Information', 'Please provide a description and ensure location is detected.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_BASE_URL, {
        description,
        location,
        phoneNumber: phoneNumber || null,
        source: 'app',
      });
      console.log('Help request submitted:', response.data);
      Alert.alert('Success', 'Your help request has been submitted!', [
        { text: 'OK', onPress: () => router.replace('/success') }
      ]);
    } catch (error) {
      console.error('Error submitting help request:', error.response ? error.response.data : error.message);
      Alert.alert('Error', `Failed to submit request: ${error.response?.data?.message || error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Description of Emergency *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Trapped in flood, need medical help, no food for 2 days"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Location</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : location ? (
        <Text style={styles.locationText}>
          Detected: Lat {location.lat.toFixed(4)}, Lng {location.lng.toFixed(4)}
        </Text>
      ) : (
        <Text style={styles.errorText}>{errorMsg || 'Waiting for location detection...'}</Text>
      )}
      {location && (
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => Alert.alert("Map Feature", "Map selection not yet implemented for user submission.")}
          // For future: onPress={() => router.push({ pathname: "/map-picker", params: { currentLat: location.lat, currentLng: location.lng } })}
        >
          <Icon name="map" size={20} color="#fff" />
          <Text style={styles.mapButtonText}>View/Adjust on Map</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.label}>Phone Number (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., +1234567890"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <Button
        title={loading ? "Submitting..." : "Submit Help Request"}
        onPress={handleSubmit}
        disabled={loading || !location} // Disable if still loading location
        color="#28a745"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f7fa',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  locationText: {
    fontSize: 14,
    color: 'green',
    marginBottom: 15,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    marginBottom: 15,
  },
  mapButton: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  mapButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
  },
});