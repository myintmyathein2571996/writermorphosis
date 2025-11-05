// app/ProfilePage.tsx
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import { getGravatarUrl } from "@/utils/avatar";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState(user?.user_display_name || "");
  const [email, setEmail] = useState(user?.user_email || "");
  const [avatar, setAvatar] = useState(user?.avatar_urls?.["96"] || getGravatarUrl(user?.user_email, 120));

  if (!user) {
    return (
      <ScreenWrapper logoSource={require("../assets/images/icon.png")} showBackButton>
        <View style={styles.centered}>
          <Text style={styles.noUserText}>You’re not signed in.</Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            style={styles.loginButton}
          >
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.back();
  };

  const handleAvatarChange = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission denied", "You need to allow access to select an image.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!pickerResult.canceled) {
      setAvatar(pickerResult.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      await updateUser({
        user_display_name: displayName,
        user_email: email,
        avatar: avatar,
      });
      Alert.alert("Success", "Profile updated!");
      setEditMode(false);
    } catch (err) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <ScreenWrapper
      logoSource={require("../assets/images/icon.png")}
      title="PROFILE"
      showBackButton
      scrollable={false}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar */}
        <TouchableOpacity onPress={editMode ? handleAvatarChange : undefined}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          {editMode && <Text style={styles.changeAvatarText}>Change Avatar</Text>}
        </TouchableOpacity>

        {/* Editable Fields */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name</Text>
          {editMode ? (
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              style={styles.input}
            />
          ) : (
            <Text style={styles.value}>{displayName}</Text>
          )}

          <Text style={styles.label}>Email</Text>
          {editMode ? (
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={styles.value}>{email}</Text>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Comments</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
        </View>

        {/* Action Buttons */}
        {editMode ? (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditMode(true)}
          >
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
  },
  changeAvatarText: {
    color: "#f4d6c1",
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  infoContainer: {
    width: "100%",
    marginTop: 16,
  },
  label: {
    color: "#c2c2c2",
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    color: "#f8f8f6",
    fontSize: 16,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#2a2a2a",
    color: "#f8f8f6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    paddingVertical: 16,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    color: "#f8f8f6",
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    color: "#c2c2c2",
    fontSize: 12,
    marginTop: 4,
  },
  editButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  editText: {
    color: "#f4d6c1",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#4a7c59",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveText: {
    color: "#f8f8f6",
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#4a3a32",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutText: {
    color: "#f8f8f6",
    fontWeight: "600",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noUserText: {
    color: "#f8f8f6",
    fontSize: 16,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#4a3a32",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginText: {
    color: "#f8f8f6",
    fontWeight: "600",
  },
});
