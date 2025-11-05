import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from "../context/AuthContext";

// import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  // const colorScheme = useColorScheme();
console.log("AuthProvider check:", AuthProvider);

  return (
     <AuthProvider>
    {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="category/[slug]" options={{ headerShown: false }} />
        <Stack.Screen name="tag/[slug]" options={{ headerShown: false }} />
         <Stack.Screen name="post/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="author/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
               <Stack.Screen name="profile" options={{ headerShown: false }} />
                 <Stack.Screen name="randomPost" options={{ headerShown: false }} />
                    <Stack.Screen name="quiz" options={{ headerShown: false }} />
                     <Stack.Screen name="notifications" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    {/* </ThemeProvider> */}
    </AuthProvider>
  );
}
