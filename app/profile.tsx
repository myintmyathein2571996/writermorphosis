// app/ProfilePage.tsx
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState(user?.display_name || "");
  const [email, setEmail] = useState(user?.user_email || "");

  const profilePhotoUrl =
    user?.profile_photo?.match(/src="([^"]+)"/)?.[1] ||
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  const [avatar, setAvatar] = useState(profilePhotoUrl);

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

  // const handleAvatarChange = async () => {
  //   const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (!permissionResult.granted) {
  //     Alert.alert("Permission denied", "You need to allow access to select an image.");
  //     return;
  //   }

  //   const pickerResult = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 0.8,
  //   });

  //   if (!pickerResult.canceled) {
  //     setAvatar(pickerResult.assets[0].uri);
  //   }
  // };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("display_name", displayName);
      formData.append("user_email", email);

      console.log(formData);
      

      // if avatar is local, upload as file
      // if (avatar && avatar.startsWith("file")) {
      //   const filename = avatar.split("/").pop();
      //   const fileType = filename?.split(".").pop() || "jpg";
      //   formData.append("avatar", {
      //     uri: avatar,
      //     name: filename,
      //     type: `image/${fileType}`,
      //   } as any);
      // }

      // make API request
      const response = await axios.post(
        "https://writermorphosis.com/wp-json/um/v1/user",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`, // if your login API gives JWT
          },
        }
      );

      console.log(response);
      

      // if (response.status === 200) {
      //   Alert.alert("Success", "Profile updated!");
      //   setEditMode(false);
      // } else {
      //   throw new Error("Unexpected response from server");
      // }
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.response?.data?.message || "Failed to update profile.");
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
        {/* <TouchableOpacity onPress={editMode ? handleAvatarChange : undefined}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          {editMode && <Text style={styles.changeAvatarText}>Change Avatar</Text>}
        </TouchableOpacity> */}

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

        {/* Buttons */}
        {editMode ? (
          <TouchableOpacity style={styles.saveButton} onPress={ handleSave}>
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
