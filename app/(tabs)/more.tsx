import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import { Feather } from "@expo/vector-icons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MoreScreen() {
  const { user, logout } = useAuth();
  const appVersion = "v1.0.3";

  const handleProfilePress = () => {
    if (!user) {
      router.push("/(auth)/login");
    } else {
      router.push("/profile"); // 👈 make a new page like app/profile.tsx
    }
  };

  return (
    <ScreenWrapper
      logoSource={require("../../assets/images/icon.png")}
      onProfilePress={handleProfilePress}
      onNotificationPress={() => console.log("Notification tapped")}
      loading={false}
    >
      <View style={{ flex: 1 }}>
        {/* Header */}
        <TouchableOpacity
          onPress={handleProfilePress}
          activeOpacity={0.8}
          style={styles.profileContainer}
        >
          <Image
            source={{
              uri:
                user?.avatar_urls?.["96"] ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            }}
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>
              {user?.user_display_name || "Guest User"}
            </Text>
            <Text style={styles.profileEmail}>
              {user?.user_email || "Tap to Sign In"}
            </Text>
          </View>

          <Feather name="chevron-right" size={20} color="#a59d94" />
        </TouchableOpacity>

        {/* Explore Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXPLORE</Text>

          <TouchableOpacity
            style={[styles.card, styles.topCard]}
            activeOpacity={0.8}
            onPress={() => router.push("/randomPost")}
          >
            <View style={styles.left}>
              <View style={styles.iconWrapper}>
                <Feather name="shuffle" size={20} color="#d8d3ca" />
              </View>
              <View>
                <Text style={styles.title}>Random Posts</Text>
                <Text style={styles.subtext}>Discover something new</Text>
              </View>
            </View>
            <SimpleLineIcons name="arrow-right" size={20} color="#d8d3ca" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.bottomCard]}
            activeOpacity={0.8}
            onPress={() => router.push("/quiz")}
          >
            <View style={styles.left}>
              <View style={styles.iconWrapper}>
                <Feather name="help-circle" size={20} color="#d8d3ca" />
              </View>
              <View>
                <Text style={styles.title}>Quizzes</Text>
                <Text style={styles.subtext}>Test your knowledge</Text>
              </View>
            </View>
            <SimpleLineIcons name="arrow-right" size={20} color="#d8d3ca" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {/* {user && (
            <TouchableOpacity
              onPress={logout}
              activeOpacity={0.7}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          )} */}
          <Text style={styles.versionText}>App Version {appVersion}</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2422",
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#3d3330",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  profileName: {
    color: "#d8d3ca",
    fontSize: 18,
    fontWeight: "600",
  },
  profileEmail: {
    color: "#a59d94",
    fontSize: 13,
    marginTop: 3,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    color: "#a59d94",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    backgroundColor: "#2a2422",
    borderColor: "#3d3330",
  },
  topCard: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  bottomCard: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#3d3330",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#d8d3ca",
  },
  subtext: {
    fontSize: 12,
    color: "#a59d94",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#3d3330",
  },
  logoutButton: {
    backgroundColor: "#4a3a32",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
  versionText: {
    color: "#a59d94",
    fontSize: 12,
  },
});
