import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'index') iconName = 'home';
          else if (route.name === 'game') iconName = 'game-controller';
          else if (route.name === 'portfolio') iconName = 'person-circle';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    />
  );
}
