import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to CrisisConnect</Text>
        <Link href="/help-form" asChild>
          <Button title="Submit Help Request" />
        </Link>
        {/* Corrected line: style={styles.adminButton} is now on Button */}
        <Link href="/admin-dashboard" asChild>
          <Button title="Go to Admin Dashboard" color="#007bff" style={styles.adminButton} />
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  adminButton: {
    marginTop: 10,
  }
});