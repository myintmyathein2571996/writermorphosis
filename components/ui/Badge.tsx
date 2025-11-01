import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BadgeProps {
  text: string;
  style?: object;
}

export const Badge = ({ text, style }: BadgeProps) => {
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#d2884a", // purple
    alignSelf: "flex-start",
  },
  text: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
