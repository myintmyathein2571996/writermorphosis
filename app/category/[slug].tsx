import { getPosts } from "@/api/api";
import { CategoryPostCard } from "@/components/CategoryPostCard";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
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

export default function CategoryPage() {
  const { slug, id, name } = useLocalSearchParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [page, setPage] = useState(1);
  const flatListRef = useRef<FlatList>(null);

  // ✅ Fetch category info from WP API
  const fetchCategory = useCallback(async () => {
    try {
      const res = await fetch(`https://writermorphosis.com/wp-json/wp/v2/categories?slug=${slug}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setCategory(data[0]);
      }
    } catch (err) {
      console.error("Failed to load category:", err);
    }
  }, [slug]);

  // ✅ Fetch posts by category
  const fetchCategoriesPosts = useCallback(
    async (pageNum = 1, reset = false) => {
      try {
        if (pageNum === 1) setLoading(true);

        const res = await getPosts(pageNum, 10, { categories: id });
        const data = res?.data || [];

        if (!data.length || data.length < 10) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setPosts((prev) => {
          const merged = reset || pageNum === 1 ? data : [...prev, ...data];
          const unique = Array.from(new Map(merged.map((p) => [p.id, p])).values());
          return unique;
        });
      } catch (err: any) {
        if (err?.response?.status === 400) {
          setHasMore(false);
        } else {
          console.error("Failed to load category posts:", err);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [id]
  );

  useEffect(() => {
    fetchCategory();
    fetchCategoriesPosts();
  }, [fetchCategory, fetchCategoriesPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchCategory();
    await fetchCategoriesPosts(1, true);
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchCategoriesPosts(nextPage);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Feather name="file-text" size={48} color="#999" />
      <Text style={styles.emptyText}>No posts found</Text>
      <TouchableOpacity onPress={() => fetchCategoriesPosts(1, true)} style={styles.retryButton}>
        <Feather name="refresh-cw" size={18} color="#000" />
        <Text style={styles.retryButtonText}>Reload</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.categoryTitle}>{category?.name || name}</Text>

      <View style={styles.countBadge}>
        <Text style={styles.countText}>{category?.count || 0} posts</Text>
      </View>

      <Text style={styles.categoryDescription}>
        {category?.description
          ? category.description.replace(/<\/?[^>]+(>|$)/g, "")
          : "No description available."}
      </Text>
    </View>
  );

  return (
    <ScreenWrapper
      logoSource={require("../../assets/images/icon.png")}
      loading={loading}
      showBackButton
      title="Categorized"
      scrollable={false}
    >
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#d2884a" />
        </View>
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            ListHeaderComponent={renderHeader}
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <CategoryPostCard post={item} />}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={!loading && renderEmpty}
            onEndReachedThreshold={0.4}
            onEndReached={posts.length > 5 ? loadMore : null}
            ListFooterComponent={
              loadingMore ? (
                <View style={{ paddingVertical: 20 }}>
                  <ActivityIndicator size="small" color="#f5b041" />
                </View>
              ) : null
            }
            onScroll={({ nativeEvent }) => {
              setShowScrollTop(nativeEvent.contentOffset.y > 300);
            }}
            showsVerticalScrollIndicator={false}
          />

          {showScrollTop && (
            <TouchableOpacity style={styles.scrollTopButton} onPress={scrollToTop}>
              <Feather name="arrow-up" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    marginBottom: 20,
    padding: 16,
    // borderRadius: 12,
    // backgroundColor: "#2a2422",
    alignItems: "center",
  },
  categoryTitle: {
    color: "#f4d6c1",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  countBadge: {
    backgroundColor: "#8a4b38",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  countText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  categoryDescription: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
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
