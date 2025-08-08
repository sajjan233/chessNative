// app/dashboard/index.js
import React, { useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/'); // Redirect to login if token not found
      }
    };
    checkToken();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userid');
      router.replace('/'); // Redirect to login
    } catch (err) {
      Alert.alert('Logout Error', 'Something went wrong.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>📊 Welcome to Dashboard</Text>

      <Button title="♟️ Play Chess" onPress={() => router.push('/dashboard/game')} />

      <View style={{ height: 20 }} />

      <Button title="🌐 Open Portfolio" onPress={() => router.push('/dashboard/web')} />

      <View style={{ height: 40 }} />

      <Button title="🚪 Logout" color="red" onPress={handleLogout} />
    </View>
  );
}
