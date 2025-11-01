// ScreenWrapper.tsx
import React, { ReactNode } from "react";
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "./Header";

interface ScreenWrapperProps {
  children: ReactNode;
  logoSource: any; // require(...) or { uri: '...' }
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
  scrollable?: boolean; 
  loading?: boolean; // new prop to show loading
}

export function ScreenWrapper({
  children,
  logoSource,
  onProfilePress,
  onNotificationPress,
  scrollable = true,
  loading = false,
}: ScreenWrapperProps) {
  const Container = scrollable ? ScrollView : View;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <Header
        logoSource={logoSource}
        onProfilePress={onProfilePress}
        onNotificationPress={onNotificationPress}
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
    backgroundColor: "#1e1a18",
  },
  content: {
    flex: 1,
    // padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
