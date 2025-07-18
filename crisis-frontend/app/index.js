// crisis-frontend/app/index.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import AdminDashboardScreen from './admin-dashboard';

export default function Index() {
  return (
    <View style={styles.container}>
      <AdminDashboardScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
});
