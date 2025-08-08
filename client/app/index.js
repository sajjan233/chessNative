// app/index.js
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        router.replace('/dashboard');  // ✅ If logged in
      } else {
        router.replace('/login');      // 🔐 Not logged in
      }
    };

    checkLogin();
  }, []);

  return null; 
}
