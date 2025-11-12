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
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(user?.custom_avatar || null);
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [description, setDescription] = useState(user?.description || "");
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

const [loggingOut, setLoggingOut] = useState(false);


  // Sync user info when context updates
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
      await updateUser(res.data);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  const handleAvatarChange = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

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
          "https://writermorphosis.com/wp-json/custom/v1/avatar",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        await refreshUserData();
      } catch (err: any) {
        console.error(err.response?.data);
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

      await axios.post(
        `https://writermorphosis.com/wp-json/wp/v2/users/${user?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setEditModalVisible(false);
      await refreshUserData();
    } catch (err: any) {
      console.error(err.response?.data);
    } finally {
      setSaving(false);
    }
  };

  const confirmLogout = () => setLogoutModalVisible(true);

  const handleLogout = async () => {
    setLogoutModalVisible(false);
    await logout();
    router.replace("/(auth)/login");
  };


  const handleLogoutConfirm = async () => {
  try {
    setLoggingOut(true);

    if (token) {
      await fetch("https://writermorphosis.com/wp-json/custom/v1/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }

    await logout();
    setLogoutModalVisible(false);
    router.replace("/(auth)/login");
  } catch (error) {
    console.error("Logout failed:", error);
    Alert.alert("Error", "Failed to log out. Please try again.");
  } finally {
    setLoggingOut(false);
  }
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
        {/* Profile Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleAvatarChange}>
            <Image source={{ uri: profilePhotoUrl }} style={styles.avatar} />
          </TouchableOpacity>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#5a4438" }]}
            onPress={() => setEditModalVisible(true)}
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
        <TouchableOpacity
  style={[styles.actionButton, { backgroundColor: "#8a4b38" }]}
  onPress={() => setLogoutModalVisible(true)}
>
  <Text style={styles.actionText}>Logout</Text>
</TouchableOpacity>

        </View>

        {/* Posts */}
        {!user.roles?.includes("subscriber") && (
          <View style={{ marginTop: 30, width: "100%" }}>
            <Text style={styles.sectionTitle}>My Posts</Text>
            {loadingPosts ? (
              <ActivityIndicator size="large" color="#f4d6c1" />
            ) : posts.length === 0 ? (
              <View style={styles.noPostContainer}>
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/4076/4076549.png",
                  }}
                  style={styles.noPostImage}
                />
                <Text style={styles.noPostTitle}>No posts yet</Text>
                <Text style={styles.noPostSubtitle}>
                  When you publish your first story, it will appear here.
                </Text>
              </View>
            ) : (
              <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <VerticalPostCard post={item} key={item.id} />}
                scrollEnabled={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <ScrollView>
              <View style={styles.modalField}>
                <Text style={styles.label}>Display Name</Text>
                <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} />
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
                  style={[styles.modalButton, { backgroundColor: "#3b302d" }]}
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

      {/* Logout Modal */}
   <Modal
  visible={logoutModalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setLogoutModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.logoutBox}>
      <Text style={styles.logoutTitle}>Confirm Logout</Text>
      <Text style={styles.logoutMessage}>
        Are you sure you want to log out of your account?
      </Text>

      <View style={styles.logoutButtons}>
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: "#333" }]}
          onPress={() => setLogoutModalVisible(false)}
          disabled={loggingOut}
        >
          <Text style={styles.logoutBtnText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: "#8a4b38" }]}
          onPress={handleLogoutConfirm}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.logoutBtnText}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
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
    borderWidth: 2,
    borderColor: "#f4d6c1",
  },
  displayName: { color: "#f8f8f6", fontSize: 20, fontWeight: "700", marginTop: 10 },
  email: { color: "#cfcfcf", fontSize: 14 },
  description: {
    color: "#c2c2c2",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  buttonRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutBox: {
  backgroundColor: "#2a2a2a",
  padding: 24,
  borderRadius: 12,
  alignItems: "center",
},
logoutTitle: {
  color: "#f4d6c1",
  fontSize: 20,
  fontWeight: "700",
  marginBottom: 8,
},
logoutMessage: {
  color: "#ccc",
  fontSize: 14,
  textAlign: "center",
  marginBottom: 20,
  lineHeight: 20,
},
logoutButtons: {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
},
logoutBtn: {
  flex: 1,
  marginHorizontal: 6,
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: "center",
},
logoutBtnText: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 15,
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

  // Modal base
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#2a2422",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    color: "#f4d6c1",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  modalField: { marginBottom: 14 },
  label: { color: "#c2c2c2", fontSize: 13, marginBottom: 4 },
  input: {
    backgroundColor: "#3a322e",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontWeight: "600" },
  noPostContainer: {
    alignItems: "center",
    paddingVertical: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    backgroundColor: "#1f1f1f",
    marginTop: 10,
  },
  noPostImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
    opacity: 0.8,
  },
  noPostTitle: {
    color: "#f4d6c1",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  noPostSubtitle: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
});
