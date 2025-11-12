import {
  registerForPushNotificationsAsync,
  saveTokenToWordPress,
} from "@/utils/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { getAnalytics, logEvent, setUserId, setUserProperties } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { useEffect } from "react";
import "react-native-reanimated";
import { AuthProvider } from "../context/AuthContext";

// ---------------- Firebase Config ----------------
export const firebaseConfig = {
  apiKey: "AIzaSyDEijiatfrEu01Xt7L4OXLMu5gov8vMUnY",
  authDomain: "writerposis.firebaseapp.com",
  projectId: "writerposis",
  storageBucket: "writerposis.firebasestorage.app",
  messagingSenderId: "693215902955",
  appId: "1:236620408483:android:34ac2877957eadc3680116",
  measurementId: "", // optional
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ---------------- Notification Handler ----------------
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const router = useRouter();

  // ---------------- Firebase Analytics ----------------
  useEffect(() => {
    const logAppOpen = async () => {
      try {
        await logEvent(analytics, "app_open", {
          screen: "Home",
          purpose: "App started",
        });

        // Optional: set user properties
        await setUserId(analytics, "guest_or_user_id");
        await setUserProperties(analytics, { role: "guest" });
      } catch (err) {
        console.warn("Analytics log error:", err);
      }
    };

    logAppOpen();
  }, []);

  // ---------------- Push Notifications ----------------
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
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
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
