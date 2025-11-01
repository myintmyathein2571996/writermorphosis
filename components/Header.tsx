import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface HeaderProps {
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
  logoSource: any; // require('...') or { uri: '...' }
}

export function Header({ onProfilePress, onNotificationPress, logoSource }: HeaderProps) {
  return (
    <View style={styles.container}>
      {/* Left: Profile */}
      {/* <TouchableOpacity onPress={onProfilePress} style={styles.sideIcon}>
        <User color="#fff" size={28} />
      </TouchableOpacity> */}

      {/* Center: App Logo */}
      <Image source={logoSource} style={styles.logo} resizeMode="contain" />

      {/* Right: Notification */}
      {/* <TouchableOpacity onPress={onNotificationPress} style={styles.sideIcon}>
        <Bell color="#fff" size={28} />
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: "#d2884a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  logo: {
    height: 60,
    width: 120,
  },
  sideIcon: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
