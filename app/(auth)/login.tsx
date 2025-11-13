import { login as wpLogin } from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  if (!username || !password) {
    Alert.alert("Error", "Please enter both username and password.");
    return;
  }

  setLoading(true);
  try {
    const res = await wpLogin(username, password);

    // Check for HTML-formatted errors from WP
    if (typeof res === "string" && res.includes("<")) {
      const plainText = res.replace(/<[^>]+>/g, ""); // remove HTML tags
      throw new Error(plainText);
    }

    if (!res?.token) throw new Error("Invalid login response");

    const userRes = await fetch(`https://writermorphosis.com/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Bearer ${res.token}` },
    });

    if (!userRes.ok) throw new Error("Failed to fetch user data");
    const userData = await userRes.json();

    await login(userData, res.token);
    Alert.alert("Welcome back!", `Hello ${userData.user_login || "User"}!`);
    router.replace("/");
  } catch (e: any) {
    console.error("Login error:", e);
    const cleanMsg = e.message?.replace(/<[^>]+>/g, "") || "Please try again.";
    Alert.alert("Login Failed", cleanMsg.trim());
  } finally {
    setLoading(false);
  }
};


  const handleForgotPassword = () => {
    router.push("/(auth)/forgotPassword");
  };

  const handleGuest = async () => {
   
    
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Header */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue or explore as guest</Text>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          placeholderTextColor="#8b7d75"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#8b7d75"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Forgot Password */}
        <TouchableOpacity
          onPress={handleForgotPassword}
          style={{ alignSelf: "flex-end", marginBottom: 20 }}
        >
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Guest Login */}
        <TouchableOpacity
          style={[styles.guestButton, loading && { opacity: 0.7 }]}
          onPress={handleGuest}
          disabled={loading}
        >
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>

        {/* Register Link */}
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={[styles.link, { marginTop: 16 }]}>
            Don’t have an account? Register
          </Text>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    color: "#f0e8df",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    color: "#a89f97",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
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
  guestButton: {
    marginTop: 12,
    paddingVertical: 14,
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#5a4438",
    alignItems: "center",
  },
  guestText: {
    color: "#d2c7be",
    fontSize: 15,
    fontWeight: "500",
  },
  link: {
    color: "#b5a99e",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
