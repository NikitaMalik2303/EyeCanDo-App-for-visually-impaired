import CheckAuth from '@/components/constants/CheckAuth';
import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <>
    <CheckAuth isPublic={false} />
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="directory/add" options={{ headerShown: false }} />
    </Stack>
    </>

  );
}

