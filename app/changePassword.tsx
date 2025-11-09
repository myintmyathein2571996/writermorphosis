import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ChangePasswordPage() {
  const { token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://writermorphosis.com/wp-json/custom/v1/change-password",
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", res.data.message || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.back();
    } catch (err: any) {
      console.error(err.response?.data || err);
      Alert.alert("Error", err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper
      logoSource={require("../assets/images/icon.png")}
      title="CHANGE PASSWORD"
      showBackButton
      scrollable={false}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Change Your Password</Text>
          <Text style={styles.subtitle}>Update your account password securely</Text>

          <TextInput
            style={styles.input}
            placeholder="Current Password"
            placeholderTextColor="#8b7d75"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#8b7d75"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            placeholderTextColor="#8b7d75"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1a18",
    // justifyContent: "center",
    // alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#2a2422",
    width: "100%",
    // paddingVertical : 16,
    borderRadius: 16,
    padding: 28,
    marginTop: 32,
    // shadowColor: "#000",
    // shadowOpacity: 0.3,
    // shadowOffset: { width: 0, height: 4 },
    // shadowRadius: 8,
    // elevation: 8,
    alignItems: "center",
  },
  title: {
    color: "#e0d8cf",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#a89f97",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 28,
  },
  input: {
    backgroundColor: "#3a322e",
    color: "#f0e8df",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#4b3f39",
    width: "100%",
  },
  button: {
    backgroundColor: "#5a4438",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

