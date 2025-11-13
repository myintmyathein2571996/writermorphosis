import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import React from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";

export default function AboutPage() {
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  return (
    <ScreenWrapper
      logoSource={require("../assets/images/icon.png")}
      title="ABOUT"
      showBackButton
      scrollable={false}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* App Info */}
        <View style={styles.card}>
          <Text style={styles.heading}>Writermorphosis</Text>
          <Text style={styles.paragraph}>
            Writermorphosis offers a user-first reading experience, without any charges or ads. 
            Explore reviews, thoughts, and reflections from local writers on popular books and philosophy. 
            Smooth and enjoyable reading guaranteed!
          </Text>
        </View>

        {/* Privacy Info */}
        <View style={styles.card}>
                <View style={{ flexDirection: "row", alignItems: "center" , gap: 8}}>
          <Feather name="lock" size={22} color="#f4d6c1" style={{ marginBottom: 8 }} />
          <Text style={styles.heading}>Privacy</Text>
          </View>
          <Text style={styles.paragraph}>
            We do not collect any personal data from users—not even emails. 
            For more details, see our device access request permission on the Play Store page.
          </Text>
        </View>

        {/* Sponsor */}
        <View style={styles.card}>
          <View style={{ flexDirection: "row", alignItems: "center" , gap: 8}}>
            <Feather name="award" size={22} color="#f4d6c1" style={{ marginBottom: 8 }} />
          <Text style={styles.heading}>Sponsor</Text>
          </View>
          <Text style={styles.paragraph}>
            The app is sponsored by{" "}
            <Text style={styles.link} onPress={() => openLink("https://finnfolio.com")}>
              Htet Ko Ko Aung
            </Text>.
          </Text>
        </View>

        {/* Developers */}
        <View style={styles.card}>
              <View style={{ flexDirection: "row", alignItems: "center" , gap: 8}}>
<Feather name="code" size={22} color="#f4d6c1" style={{ marginBottom: 8 }} />
          <Text style={styles.heading}>Developers</Text>
              </View>
          
          <Text style={styles.paragraph}>
            Developed by{" "}
            <Text style={styles.bold}>Myint Myat Hein</Text> and{" "}
            <Text style={styles.bold}>Kaung Myat Thu</Text>.
          </Text>
          <Text style={styles.paragraph}>
            Contact:{" "}
            <Text style={styles.link} onPress={() => openLink("mailto:myintmyathein.mmh1996@gmail.com")}>
              myintmyathein.mmh1996@gmail.com
            </Text>
          </Text>
        </View>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>App Version {Constants.expoConfig?.version || "1.0.0"}</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#2a2422",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f4d6c1",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 22,
  },
  link: {
    color: "#d2884a",
    textDecorationLine: "underline",
  },
  bold: {
    fontWeight: "600",
    color: "#f4d6c1",
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  versionText: {
    color: "#a59d94",
    fontSize: 12,
  },
});
