import {
  registerForPushNotificationsAsync,
  saveTokenToWordPress,
} from "@/utils/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { AuthProvider } from "../context/AuthContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // ✅ new field
    shouldShowList: true,   // ✅ new field
  }),
});


export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const router = useRouter();
  

  useEffect(() => {
    const initNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) await saveTokenToWordPress(token);
    };
    initNotifications();

    // Listen for notifications while app is open
    const receiveSub = Notifications.addNotificationReceivedListener(
      async (notification) => {
        const newNoti = {
          id: Date.now(),
          title: notification.request.content.title,
          body: notification.request.content.body,
          data: notification.request.content.data as Record<string, any>,
          time: new Date().toISOString(),
        };

        const existing =
          JSON.parse(await AsyncStorage.getItem("notifications") || "[]") ?? [];
        existing.unshift(newNoti);
        await AsyncStorage.setItem("notifications", JSON.stringify(existing));
      }
    );

    // When user taps on a notification
    const responseSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content
          .data as Record<string, any>;

        if (data?.url) {
          router.push(`/post/[id]?url=${encodeURIComponent(data.url)}`);
        } else {
          router.push("/notifications");
        }
      }
    );

    return () => {
      receiveSub.remove();
      responseSub.remove();
    };
  }, [router]);

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
        <Stack.Screen name="category/[slug]" options={{ headerShown: false }} />
        <Stack.Screen name="tag/[slug]" options={{ headerShown: false }} />
        <Stack.Screen name="post/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="author/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
         <Stack.Screen name="(auth)/forgotPassword" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="randomPost" options={{ headerShown: false }} />
        <Stack.Screen name="quiz" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
         <Stack.Screen name="about" options={{ headerShown: false }} />
          <Stack.Screen name="changePassword" options={{ headerShown: false }} />
            <Stack.Screen name="dailyQuote" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
