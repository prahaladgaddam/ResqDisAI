// crisis-frontend/app/map-picker.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useLocalSearchParams, router } from 'expo-router';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function MapPickerScreen() {
  const params = useLocalSearchParams();
  const initialLat = params?.lat ? parseFloat(params.lat) : null;
  const initialLng = params?.lng ? parseFloat(params.lng) : null;

  const [region, setRegion] = useState(null);
  const [markerCoords, setMarkerCoords] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location to use the map picker.');
        // If permission denied, try to set a default region
        setRegion({
          latitude: initialLat || 28.6139, // Default to Delhi if no initial coords
          longitude: initialLng || 77.2090,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
        return;
      }

      if (initialLat && initialLng) {
        setMarkerCoords({ latitude: initialLat, longitude: initialLng });
        setRegion({
          latitude: initialLat,
          longitude: initialLng,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
      } else {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setMarkerCoords({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        setRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
      }
    })();
  }, [initialLat, initialLng]);

  const onMapPress = (e) => {
    setMarkerCoords(e.nativeEvent.coordinate);
  };

  const onSelectLocation = () => {
    if (markerCoords) {
      // Return selected coordinates to the previous screen (e.g., AdminDashboard)
      // This is a simple example. In a real app, you might use a context or global state.
      // For Expo Router, a common pattern is to use a global event or a callback on a shared context.
      // For now, we'll just log and pop.
      console.log('Selected Location:', markerCoords);
      // Example of how you might pass data back (requires specific setup on the calling screen)
      // For now, just navigate back. The dashboard can then re-fetch or use a more robust state management
      router.back(); // Or router.navigate({ pathname: '/admin-dashboard', params: { selectedLat: markerCoords.latitude, selectedLng: markerCoords.longitude } });
    } else {
      Alert.alert('No Location Selected', 'Please tap on the map to select a location.');
    }
  };

  if (!region) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onPress={onMapPress}
        onRegionChangeComplete={setRegion} // Keep the map centered on user interaction
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {markerCoords && (
          <Marker
            coordinate={markerCoords}
            title="Selected Location"
            draggable
            onDragEnd={(e) => setMarkerCoords(e.nativeEvent.coordinate)}
          />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Select Location" onPress={onSelectLocation} disabled={!markerCoords} />
        <Button title="Cancel" onPress={() => router.back()} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8, // 80% of screen height
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 10,
  },
});