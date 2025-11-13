import Constants from "expo-constants";
import { Platform } from "react-native";

let analyticsInstance: any = null;

/**
 * Initialize analytics if running on native and the native module is available.
 * react-native-firebase analytics initializes itself when native is configured,
 * but we keep a small wrapper so web doesn't crash and calls are safe.
 */
export async function initAnalytics(): Promise<void> {
  // Avoid initializing native analytics on web or when running inside Expo Go
  // (appOwnership === 'expo') because the native @react-native-firebase modules
  // aren't available there and will throw RNFBAppModule not found.
  if (Platform.OS === "web") return;
  if (Constants?.appOwnership === "expo") {
    // Running in Expo Go — native Firebase modules aren't available.
    // eslint-disable-next-line no-console
    console.warn("Skipping native analytics initialization in Expo Go");
    return;
  }
  if (analyticsInstance) return;

  try {
    // require at runtime to avoid bundling native-only module on web
    // @react-native-firebase/analytics exports a default function
    // that returns the analytics instance when called.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const analyticsModule = require("@react-native-firebase/analytics").default;
    analyticsInstance = analyticsModule();
  } catch (err) {
    // If the native module is not linked or running on web, just warn.
    // Keep this non-fatal so the app still runs in dev/web environments.
    // Use console.warn instead of console.error to avoid failing tests.
    // eslint-disable-next-line no-console
  console.warn("Analytics module not available:", String(err));
  }
}

export async function logEvent(name: string, params?: Record<string, any>) {
  if (Platform.OS === "web") return;

  try {
    if (!analyticsInstance) await initAnalytics();
    if (analyticsInstance && typeof analyticsInstance.logEvent === "function") {
      await analyticsInstance.logEvent(name, params ?? {});
    }
  } catch (err) {
    // Non-fatal; keep app stable if analytics fails
    // eslint-disable-next-line no-console
  console.warn("Failed to log analytics event:", String(err));
  }
}

export async function setUserId(id?: string) {
  if (Platform.OS === "web") return;

  try {
    if (!analyticsInstance) await initAnalytics();
    if (analyticsInstance && typeof analyticsInstance.setUserId === "function") {
      await analyticsInstance.setUserId(id ?? null);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
  console.warn("Failed to set analytics user id:", String(err));
  }
}

export async function setUserProperties(props: Record<string, any>) {
  if (Platform.OS === "web") return;

  try {
    if (!analyticsInstance) await initAnalytics();
    if (analyticsInstance && typeof analyticsInstance.setUserProperties === "function") {
      await analyticsInstance.setUserProperties(props);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
  console.warn("Failed to set analytics user properties:", String(err));
  }
}
