import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  logoSource: any;
  profileImage?: string; // profile URL if logged in
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
  showBackButton?: boolean;
  title?: string;
  isLoggedIn?: boolean;
}

export function Header({
  logoSource,
  profileImage,
  onProfilePress,
  onNotificationPress,
  showBackButton = false,
  title,
  isLoggedIn = false,
}: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Left: Back button or Profile */}
      {isLoggedIn && profileImage ? (
        <TouchableOpacity onPress={onProfilePress} style={styles.sideIcon}>
          <Image
            source={{ uri: profileImage }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      ) : showBackButton ? (
        <TouchableOpacity onPress={() => router.back()} style={styles.sideIcon}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.sideIcon} />
      )}

      {/* Center: Logo or Title */}
      {title ? (
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      ) : (
        <Image source={logoSource} style={styles.logo} resizeMode="contain" />
      )}

      {/* Right: Notification or empty space */}
      {isLoggedIn ? (
        <TouchableOpacity onPress={onNotificationPress} style={styles.sideIcon}>
          <Feather name="bell" size={22} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.sideIcon} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: "#d2884a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  logo: {
    height: 50,
    width: 120,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  sideIcon: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
