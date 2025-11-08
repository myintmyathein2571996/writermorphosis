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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await wpLogin(username, password);
      console.log("Login response:", res);

      if (!res.token) {
        throw new Error("Invalid login response");
      }

      const userRes = await fetch(
        `https://writermorphosis.com/wp-json/custom/v1/user`,
        {
          headers: {
            Authorization: `Bearer ${res.token}`,
          },
        }
      );

      if (!userRes.ok) throw new Error("Failed to fetch user data");

      const userData = await userRes.json();
      console.log(userData);
      
      console.log("Fetched user data:", userData);
      console.log(res.token);
      

      await login(userData, res.token);
      Alert.alert("Welcome back!", `Hello ${userData.user_login || "User"}!`);
      router.replace("/");
    } catch (e: any) {
      console.error("Login error:", e);
      Alert.alert("Login Failed", e.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const codeCommment = true;

  if(codeCommment){
    return <View style={styles.container}><Text style = {{color : '#fff'}}>Login Page</Text></View>
  }

  return (
    <View style={styles.container}>
    
    
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#8b7d75"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#8b7d75"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

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

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>Don’t have an account? Register</Text>
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
    borderRadius: 16,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    color: "#e0d8cf",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },
  subtitle: {
    color: "#a89f97",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 28,
    marginTop: 4,
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
  link: {
    color: "#b5a99e",
    textAlign: "center",
    marginTop: 18,
    textDecorationLine: "underline",
    fontSize: 14,
  },
});
