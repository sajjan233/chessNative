import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');

      if (!token && segments[0] !== 'login') {
        router.replace('/login');
      } else if (token && segments[0] === 'login') {
        router.replace('/dashboard');
      }

      setLoading(false);
    };

    checkLogin();
  }, [segments]);

  if (loading) return null;

  return <Slot />;
}
