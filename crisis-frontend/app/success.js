// crisis-frontend/app/success.js
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';

export default function SuccessScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Request Submitted Successfully!</Text>
        <Text style={styles.message}>Thank you for reaching out. Rescue teams have been notified.</Text>
        <Button title="Go to Home" onPress={() => router.replace('/')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e6ffe6',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#28a745',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
});