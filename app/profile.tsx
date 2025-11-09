import { getPosts } from "@/api/api";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { VerticalPostCard } from "@/components/VerticalPostCard";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfilePage() {
  const { user, logout, token, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(user?.custom_avatar || null);
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [description, setDescription] = useState(user?.description || "");
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // 🟢 Whenever user data changes (from refreshUserData or context), update local state
  useEffect(() => {
    if (user) {
      setDisplayName(user.name || "");
      setEmail(user.email || "");
      setDescription(user.description || "");
      setAvatar(user.custom_avatar || null);
    }
  }, [user]);

  useEffect(() => {
    if (user && !user.roles?.includes("subscriber")) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      setLoadingPosts(true);
      const postsData = await getPosts(1, 20, { author: user?.id });
      setPosts(postsData.data);
    } catch (err) {
      console.error("Failed to load user posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const res = await axios.get("https://writermorphosis.com/wp-json/wp/v2/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      await updateUser(res.data); // ✅ updates AuthContext user state
    } catch (err) {
      console.error("Failed to refresh user:", err);
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
      const imageUri = result.assets[0].uri;
      setAvatar(imageUri);

      try {
        const formData = new FormData();
        formData.append("avatar", {
          uri: imageUri,
          name: "avatar.jpg",
          type: "image/jpeg",
        } as any);

        const res = await axios.post(
          "https://writermorphosis.com/wp-json/custom/v1/upload-avatar",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        Alert.alert("Success", res.data.message || "Avatar updated!");
        await refreshUserData();
      } catch (err: any) {
        console.error(err.response?.data);
        Alert.alert("Error", err.response?.data?.message || "Failed to upload avatar");
      }
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", displayName);
      formData.append("email", email);
      formData.append("description", description);

      const res = await axios.post(
        `https://writermorphosis.com/wp-json/wp/v2/users/${user?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Alert.alert("Success", res.data.message || "Profile updated successfully!");
      setEditModalVisible(false);
      await refreshUserData();
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

  const profilePhotoUrl =
    avatar || user?.custom_avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <ScreenWrapper
      logoSource={require("../assets/images/icon.png")}
      title="PROFILE"
      showBackButton
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar + Info */}
        <View style={styles.avatarSection}>
          <Image source={{ uri: profilePhotoUrl }} style={styles.avatar} />
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
          {user?.roles && (
            <Text style={styles.roleText}>
              Role: {Array.isArray(user.roles) ? user.roles.join(", ") : user.roles}
            </Text>
          )}
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#4a7c59" }]}
            onPress={() => setEditModalVisible(true)}
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#8a4b38" }]}
            onPress={handleLogout}
          >
            <Text style={styles.actionText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* User Posts if not subscriber */}
        {!user.roles?.includes("subscriber") && (
          <View style={{ marginTop: 30, width: "100%" }}>
            <Text style={styles.sectionTitle}>My Posts</Text>
            {loadingPosts ? (
              <ActivityIndicator size="large" color="#f4d6c1" />
            ) : (
              <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <VerticalPostCard post={item} key={item.id} />
                )}
                scrollEnabled={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <Text style={styles.modalTitle}>Edit Profile</Text>

              <TouchableOpacity onPress={handleAvatarChange} style={{ alignItems: "center" }}>
                <Image source={{ uri: profilePhotoUrl }} style={styles.modalAvatar} />
                <Text style={styles.changeAvatarText}>Change Avatar</Text>
              </TouchableOpacity>

              <View style={styles.modalField}>
                <Text style={styles.label}>Display Name</Text>
                <TextInput
                  style={styles.input}
                  value={displayName}
                  onChangeText={setDisplayName}
                />
              </View>

              <View style={styles.modalField}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.modalField}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  multiline
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#333" }]}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#4a7c59" }]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.modalButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: "center" },
  avatarSection: { alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#f4d6c1",
  },
  displayName: { color: "#f8f8f6", fontSize: 20, fontWeight: "600", marginTop: 4 },
  email: { color: "#cfcfcf", fontSize: 14 },
  roleText: { color: "#f4d6c1", fontSize: 13, marginTop: 4 },
  description: {
    color: "#c2c2c2",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 10,
  },
  buttonRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  actionText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  sectionTitle: {
    color: "#f4d6c1",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    alignSelf: "flex-start",
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

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    color: "#f4d6c1",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  changeAvatarText: { color: "#f4d6c1", fontSize: 14 },
  modalField: { marginBottom: 12 },
  label: { color: "#c2c2c2", fontSize: 13, marginBottom: 4 },
  input: {
    backgroundColor: "#3a3a3a",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontWeight: "600" },
});
