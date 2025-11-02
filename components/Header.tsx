import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HeaderProps {
  logoSource: any;
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
  showBackButton?: boolean;
  title?: string;
}

export function Header({
  logoSource,
  onProfilePress,
  onNotificationPress,
  showBackButton = false,
  title,
}: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Left: Back or empty space */}
      {showBackButton ? (
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

      {/* Right: Placeholder for symmetry */}
      <View style={styles.sideIcon} />
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
});
