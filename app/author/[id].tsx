import { getPosts } from "@/api/api";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { VerticalPostCard } from "@/components/VerticalPostCard";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AuthorPage() {
  const { id, author, authorAvatar } = useLocalSearchParams();
  const authorData = JSON.parse(author as string);

  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const flatListRef = useRef<FlatList>(null);

 const fetchAuthorPosts = useCallback(
  async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) setLoading(true);

      const res = await getPosts(pageNum, 10, { author: id });
      const data = res?.data || [];

      // ✅ if no new data, stop pagination
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
      // ✅ if 400, just mark no more data and avoid console noise
      if (err?.response?.status === 400) {
        setHasMore(false);
      } else {
        console.error("Failed to load author posts:", err);
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
    fetchAuthorPosts();
  }, [fetchAuthorPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchAuthorPosts(1, true);
  };

const loadMore = async () => {
  if (loadingMore || !hasMore) return;
  setLoadingMore(true);
  const nextPage = page + 1;
  setPage(nextPage);
  await fetchAuthorPosts(nextPage);
};


  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Feather name="file-text" size={48} color="#999" />
      <Text style={styles.emptyText}>No posts found</Text>
      <TouchableOpacity onPress={() => fetchAuthorPosts(1, true)} style={styles.retryButton}>
        <Feather name="refresh-cw" size={18} color="#000" />
        <Text style={styles.retryButtonText}>Reload</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper
      logoSource={require("../../assets/images/icon.png")}
      loading={loading}
      showBackButton
      title={"Author"}
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
            ListHeaderComponent={
              <View style={styles.headerContainer}>
                {authorData && (
                  <Image
                    source={{ uri: authorAvatar }}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                )}
                <Text style={styles.authorName}>{authorData.name}</Text>
                {authorData?.description ? (
                  <Text style={styles.description}>{authorData.description}</Text>
                ) : null}
                <View style={styles.divider} />
              </View>
            }
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <VerticalPostCard post={item} />}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
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
    alignItems: "center",
    paddingVertical: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    borderColor: "#f4d6c1",
    borderWidth: 1,
  },
  authorName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f5f2eb",
  },
  description: {
    fontSize: 14,
    color: "#cfcfcf",
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 20,
  },
  divider: {
    height: 1,
    width: "90%",
    backgroundColor: "#3c3c3c",
    marginVertical: 16,
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
