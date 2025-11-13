import {
  getLatestPosts,
  getPopularCategories,
  getPopularPosts,
  getPopularTags,
  getQuotes,
} from "@/api/api";
import { CategoryScroll } from "@/components/CategoryScroll";
import { QuoteCarousel } from "@/components/QuoteCarousel";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { TrendingTags } from "@/components/TrendingTags";
import { VerticalPostCard } from "@/components/VerticalPostCard";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [trendingTags, setTrendingTags] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [popularPosts, setPopularPosts] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"latest" | "popular">("latest");

  const [loading, setLoading] = useState(true); // whole screen loading
  const [refreshing, setRefreshing] = useState(false); // pull refresh
  const [tabLoading, setTabLoading] = useState(false); // tab switch loading

  // Fetchers
  const fetchQuotes = useCallback(async () => {
    const quoteData = await getQuotes();
    setQuotes(quoteData || []);
  }, []);

  const fetchCategories = useCallback(async () => {
    const categoriesData = await getPopularCategories();
    setCategories(categoriesData || []);
  }, []);

  const fetchTrendingTags = useCallback(async () => {
    const tagData = await getPopularTags();
    setTrendingTags(tagData || []);
  }, []);

  const fetchLatestPosts = useCallback(async () => {
    const latestData = await getLatestPosts();
    setLatestPosts(latestData?.data || []);
  }, []);

  const fetchPopularPosts = useCallback(async () => {
    const popularData = await getPopularPosts();
    setPopularPosts(popularData?.data || []);
  }, []);

  // Fetch all for initial load or refresh
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchQuotes(),
        fetchCategories(),
        fetchTrendingTags(),
        fetchLatestPosts(),
        fetchPopularPosts(),
      ]);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchQuotes, fetchCategories, fetchTrendingTags, fetchLatestPosts, fetchPopularPosts]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  // const handleTabChange = async (tab: "latest" | "popular") => {
  //   if (tab === activeTab) return;
  //   setActiveTab(tab);
  //   setTabLoading(true);

  //   try {
  //     if (tab === "latest" && latestPosts.length === 0) {
  //       await fetchLatestPosts();
  //     }
  //     if (tab === "popular" && popularPosts.length === 0) {
  //       await fetchPopularPosts();
  //     }
  //   } finally {
  //     setTabLoading(false);
  //   }
  // };

  const handleTabChange = async (tab: "latest" | "popular") => {
    if (tab === activeTab) return;

    setActiveTab(tab);
    setTabLoading(true);

    try {
      if (tab === "latest") {
        const latestData = await getLatestPosts();
        setLatestPosts(latestData?.data || []);
      } else {
        const popularData = await getPopularPosts();
        setPopularPosts(popularData?.data || []);
      }
    } catch (err) {
      console.error(`Error fetching ${tab} posts:`, err);
    } finally {
      setTabLoading(false);
    }
  };


  const postsToShow = activeTab === "latest" ? latestPosts : popularPosts;

  const handleTagPress = (slug: string , id : number) => {
    router.push({
      pathname: "/tag/[slug]",
      params: { slug , id},
    });
  };

  const NoPosts = ({ onRetry }: { onRetry: () => void }) => (
    <View style={styles.noPostsContainer}>
      <Feather name="calendar" size={64} color="#555" />
      <Text style={styles.noPostsTitle}>No posts found</Text>
      <Text style={styles.noPostsText}>No posts were published on this date</Text>
      <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
        <Feather name="refresh-cw" size={18} color="#000" />
        <Text style={styles.retryButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper
      logoSource={require("../../assets/images/icon.png")}
      scrollable={false}
      loading={loading}
    >
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Quotes */}
        {quotes.length > 0 ? (
          <QuoteCarousel quotes={quotes} />
        ) : (
          <View style={{ padding: 20, alignItems: "center" }}>
            <ActivityIndicator size="small" color="#f5b041" />
          </View>
        )}

        {/* Categories */}
        {categories.length > 0 && <CategoryScroll categories={categories} />}

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {["latest", "popular"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabWrapper,
                activeTab === tab && styles.activeTabWrapper,
              ]}
              onPress={() => handleTabChange(tab as "latest" | "popular")}
            >
              <View style={styles.tabContent}>
                <Feather
                  name={tab === "latest" ? "clock" : "star"}
                  size={16}
                  color="#d8d3ca"
                  style={styles.tabIcon}
                />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Loading Indicator */}
        {/* Tab Loading or Posts */}
        {tabLoading ? (
          <View style={styles.tabLoadingContainer}>
            <ActivityIndicator size="large" color="#f5b041" />
            <Text style={{ color: "#fff", marginTop: 10 }}>Loading {activeTab} posts...</Text>
          </View>
        ) : postsToShow.length === 0 ? (
          <NoPosts onRetry={onRefresh} />
        ) : (
          <>
            <View style={{ padding: 12 }}>
              {postsToShow.map((post) => (
                <VerticalPostCard key={post.id} post={post} />
              ))}
            </View>
            {trendingTags.length > 0 && (
              <TrendingTags tags={trendingTags} onTagClick={handleTagPress} />
            )}
          </>
        )}

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  fullScreenLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 16,
  },
  tabLoadingContainer: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  noPostsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    color: "#fff",
  },
  noPostsText: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 4,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#f5b041",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  retryButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#4a3a32",
    gap: 10,
  },
  activeTabWrapper: {
    backgroundColor: "#2a2422",
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  tabWrapper: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 18,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 13,
    color: "#d8d3ca",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#d8d3ca",
    fontWeight: "700",
  },
});
