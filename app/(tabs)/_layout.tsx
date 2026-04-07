import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/src/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: C.surface,
        borderTopColor: C.border,
        borderTopWidth: 0.5,
        paddingTop: 6,
        height: 86,
      },
      tabBarActiveTintColor: C.accent,
      tabBarInactiveTintColor: C.textTert,
      tabBarLabelStyle: { fontSize: 11, fontWeight: '500', marginBottom: 10 },
    }}>
      <Tabs.Screen name="index" options={{
        title: 'Dig',
        tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
      }} />
      <Tabs.Screen name="stack" options={{
        title: 'Stack',
        tabBarIcon: ({ color, size }) => <Ionicons name="layers" size={size} color={color} />,
      }} />
      <Tabs.Screen name="pulse" options={{
        title: 'Pulse',
        tabBarIcon: ({ color, size }) => <Ionicons name="pulse" size={size} color={color} />,
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Profile',
        tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
      }} />
    </Tabs>
  );
}
