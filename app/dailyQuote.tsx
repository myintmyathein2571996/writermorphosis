import { getQuotes } from "@/api/api";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import React, { useCallback, useEffect, useState } from "react";
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View
} from "react-native";

export default function QuoteList() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQuotes = useCallback(async () => {
    try {
      const quoteData = await getQuotes(10);
      setQuotes(quoteData || []);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchQuotes();
  }, [fetchQuotes]);

  return (
    <ScreenWrapper logoSource={require("../assets/images/icon.png")} showBackButton  loading = { loading} scrollable = {false} title="Daily Quote">
       <FlatList
          data={quotes}
          keyExtractor={(item) => item.id?.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#d2884a"
            />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.quoteText}>"{item.text}"</Text>
              <Text style={styles.authorText}>— {item.author}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No quotes found</Text>
            </View>
          }
        />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1716",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#d8d3ca",
    marginTop: 10,
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    borderWidth: 1,
    borderColor: "rgba(210,136,74,0.4)",
    borderRadius: 12,
    backgroundColor: "#2a2422",
    padding: 16,
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 14,
    color: "#d8d3ca",
    fontStyle: "italic",
    marginBottom: 6,
  },
  authorText: {
    fontSize: 12,
    color: "#d2884a",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    color: "#aaa",
    fontSize: 14,
  },
});
