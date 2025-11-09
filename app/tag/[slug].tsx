import { getPostsByTag, getTags } from "@/api/api";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { TagPostCard } from "@/components/TagPostCard";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

export default function TagDetailPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [tag, setTag] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tag info by slug
  useEffect(() => {
    const fetchTagData = async () => {
      try {
        const allTags = await getTags();
        const matched = allTags.find((t: any) => t.slug === slug);
        if (matched) {
          setTag(matched);
          const postsData = await getPostsByTag(matched.id);
          setPosts(postsData);
        } else {
          setTag({ name: `#${slug}`, description: "This tag doesn't exist.", count: 0 });
        }
      } catch (err) {
        console.error("Failed to load tag posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTagData();
  }, [slug]);

  const renderHeader = () => {
    if (!tag) return null;
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.tagTitle}>{tag.name}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{posts.length} posts</Text>
        </View>
        {tag.description ? (
          <Text style={styles.tagDescription}>{tag.description.replace(/<\/?[^>]+(>|$)/g, "")}</Text>
        ) : (
          <Text style={styles.tagDescription}>No description available.</Text>
        )}
      </View>
    );
  };

  return (
    <ScreenWrapper
      logoSource={require("../../assets/images/icon.png")}
      loading={loading}
      scrollable={false}
      showBackButton
      title={`Tagged`}
    >
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color="#d2884a" size="large" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TagPostCard post={item} onClick={() => console.log("Open post", item.id)} />
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No posts found for this tag.</Text>
          }
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#2a2422",
    alignItems: "center",
  },
  tagTitle: {
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
  tagDescription: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 30,
    fontSize: 15,
  },
});
