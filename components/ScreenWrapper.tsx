import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "./Header";

interface ScreenWrapperProps {
  children: ReactNode;
  logoSource: any;
  scrollable?: boolean;
  loading?: boolean;
  showBackButton?: boolean;
  title?: string;     // new prop
}

export function ScreenWrapper({
  children,
  logoSource,
  scrollable = true,
  loading = false,
  showBackButton = false,
  title,
}: ScreenWrapperProps) {
  const Container = scrollable ? ScrollView : View;

   const { user } = useAuth();


  const profilePhotoUrl =  user?.custom_avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png";
 
   

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" />
      <Header
        logoSource={logoSource}
       onProfilePress={() => router.push("/profile")}
  onNotificationPress={() => router.push("/notifications")}
        showBackButton={showBackButton}
        title={title}
        isLoggedIn={user != null && !showBackButton}
        profileImage={profilePhotoUrl}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f5f2eb" />
        </View>
      ) : (
        <Container style={styles.content}>{children}</Container>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1e1a18", // dark base
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
