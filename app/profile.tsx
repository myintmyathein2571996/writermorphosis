import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  const { user, logout, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (token) fetchUser();
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`https://writermorphosis.com/wp-json/custom/v1/user/${user.ID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      const photoUrl =
        data?.profile_photo?.match(/src="([^"]+)"/)?.[1] ||
        "https://cdn-icons-png.flaticon.com/512/847/847969.png";

      setProfile(data);
      setAvatar(photoUrl);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Unable to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied", "Please allow photo library access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      // append text fields
      [
        "first_name",
        "last_name",
        "display_name",
        "user_email",
        "facebook",
        "telegram",
        "youtube",
        "linkedin",
        "website",
        "description",
      ].forEach((key) => {
        if (profile?.[key] !== undefined) formData.append(key, profile[key]);
      });

      // append avatar if changed
      if (avatar && avatar.startsWith("file")) {
        const filename = avatar.split("/").pop()!;
        const ext = filename.split(".").pop()!;
        formData.append("avatar", {
          uri: avatar,
          name: filename,
          type: `image/${ext}`,
        } as any);
      }

      const res = await axios.post(
        `https://writermorphosis.com/wp-json/custom/v1/user/${user?.ID}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Alert.alert("Success", res.data.message || "Profile updated successfully!");
      setEditMode(false);
      fetchUser();
    } catch (err: any) {
      console.error(err.response?.data);
      Alert.alert("Error", err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

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

  if (loading) {
    return (
      <ScreenWrapper logoSource={require("../assets/images/icon.png")} title="PROFILE">
        <View style={styles.centered}>
          <ActivityIndicator color="#f4d6c1" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      logoSource={require("../assets/images/icon.png")}
      title="PROFILE"
      showBackButton
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={editMode ? handleAvatarChange : undefined}>
            <Image source={{ uri: avatar || "" }} style={styles.avatar} />
            {editMode && <Text style={styles.changeAvatarText}>Change Avatar</Text>}
          </TouchableOpacity>
          <Text style={styles.displayName}>{profile?.display_name}</Text>
          {profile?.description ? (
            <Text style={styles.description}>{profile.description}</Text>
          ) : null}
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          {[
            { key: "user_email", label: "Email" },
            { key: "facebook", label: "Facebook" },
            { key: "telegram", label: "Telegram" },
            { key: "youtube", label: "YouTube" },
            { key: "linkedin", label: "LinkedIn" },
            { key: "website", label: "Website" },
          ].map(({ key, label }) => (
            <View key={key} style={styles.field}>
              <Text style={styles.label}>{label}</Text>
              {editMode ? (
                <TextInput
                  style={styles.input}
                  value={profile?.[key] || ""}
                  placeholder={`Enter ${label}`}
                  placeholderTextColor="#999"
                  onChangeText={(text) => setProfile({ ...profile, [key]: text })}
                />
              ) : (
                <Text style={styles.value}>{profile?.[key] || "-"}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          {editMode ? (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#4a7c59" }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.actionText}>Save</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#333" }]}
              onPress={() => setEditMode(true)}
            >
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#8a4b38" }]}
            onPress={handleLogout}
          >
            <Text style={styles.actionText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#f4d6c1",
  },
  changeAvatarText: {
    color: "#f4d6c1",
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  displayName: {
    color: "#f8f8f6",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 4,
  },
  description: {
    color: "#c2c2c2",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 10,
  },
  card: {
    width: "100%",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    color: "#c2c2c2",
    fontSize: 13,
    marginBottom: 4,
  },
  value: {
    color: "#f8f8f6",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#3a3a3a",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  noUserText: { color: "#f8f8f6", fontSize: 16, marginBottom: 10 },
  loginButton: {
    backgroundColor: "#4a3a32",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginText: { color: "#f8f8f6", fontWeight: "600" },
});
