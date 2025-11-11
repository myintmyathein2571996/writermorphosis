import { getCategories } from "@/api/api";
import { CategoryCard } from "@/components/CategoryCard";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const fetchCategoriesData = useCallback(async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) setLoading(true);

      const res = await getCategories(pageNum);
      const data = res || [];

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setCategories((prev) => {
        const merged = reset || pageNum === 1 ? data : [...prev, ...data];
        const unique = Array.from(new Map(merged.map((c) => [c.id, c])).values());
        return unique;
      });
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesData();
  }, [fetchCategoriesData]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchCategoriesData(1, true);
  };

  const loadMore = async () => {
    console.log('loadmore', page);
    
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchCategoriesData(nextPage);
  };

  const handlePress = (slug: string, name: string) => {
    router.push({
      pathname: "/category/[slug]",
      params: { slug, name },
    });
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const filteredCategories = categories; // add search filter if needed

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Feather name="folder" size={48} color="#999" />
      <Text style={styles.emptyText}>No categories found</Text>
      <TouchableOpacity
        onPress={() => fetchCategoriesData(1, true)}
        style={styles.retryButton}
      >
        <Feather name="refresh-cw" size={18} color="#000" />
        <Text style={styles.retryButtonText}>Reload</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper
      logoSource={require("../../assets/images/icon.png")}
      loading={loading}
      scrollable={false}
    >
      <FlatList
        ref={flatListRef}
        data={filteredCategories}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            onPress={() => handlePress(item.slug, item.name)}
          />
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!loading && renderEmpty}
        onEndReachedThreshold={0.4}
        onEndReached={ filteredCategories.length > 20 ? loadMore : null}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="small" color="#f5b041" />
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          setShowScrollTop(nativeEvent.contentOffset.y > 300);
        }}
      />

      {/* Scroll to top button */}
      {showScrollTop && (
        <TouchableOpacity style={styles.scrollTopButton} onPress={scrollToTop}>
          <Feather name="arrow-up" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    color: "#ccc",
    marginTop: 8,
    fontSize: 14,
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: "#f5b041",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  retryButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
  scrollTopButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#d2884a",
    borderRadius: 30,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
});
