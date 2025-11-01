import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function History({ navigation }: any) {


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>History</Text>
    
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
