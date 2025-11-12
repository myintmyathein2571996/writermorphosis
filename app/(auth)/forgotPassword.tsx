import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [userLogin, setUserLogin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!userLogin) {
      Alert.alert("Error", "Please enter your username or email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://writermorphosis.com/wp-json/custom/v1/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_login: userLogin }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Something went wrong");

      Alert.alert(
        "Reset Link Sent",
        "Check your email for the password reset link. You can also open it directly.",
        [
          {
            text: "Open Link",
            onPress: () => Linking.openURL(data.reset_url),
          },
          { text: "OK" },
        ]
      );
    } catch (error: any) {
      console.error("Forgot password error:", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your username or email to reset your password.
        </Text>

        <TextInput
          placeholder="Username or Email"
          placeholderTextColor="#8b7d75"
          style={styles.input}
          value={userLogin}
          onChangeText={setUserLogin}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        >
          <Text style={styles.link}>← Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1a18",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#2a2422",
    width: "100%",
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
    alignItems: "center",
  },
  title: {
    color: "#f0e8df",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#a89f97",
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    color: "#b5a99e",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
