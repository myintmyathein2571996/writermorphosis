import { getPostsByTag, getTags } from "@/api/api";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { TagPostCard } from "@/components/TagPostCard";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function TagDetailPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [tagId, setTagId] = useState<number | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tag ID by slug
  useEffect(() => {
    const fetchTagId = async () => {
      try {
        const allTags = await getTags();
        const matched = allTags.find((t: any) => t.slug === slug);
        if (matched) {
          setTagId(matched.id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load tags:", err);
        setLoading(false);
      }
    };
    fetchTagId();
  }, [slug]);

  // Fetch posts when tagId found
  useEffect(() => {
    if (!tagId) return;
    const fetchPosts = async () => {
      try {
        const data = await getPostsByTag(tagId);
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch tag posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [tagId]);

  return (
    <ScreenWrapper
      logoSource={require("../../assets/images/icon.png")}
      loading={loading}
      scrollable={false}
      showBackButton
      title={`#${String(slug).toUpperCase()}`}
    >
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color="#d2884a" size="large" />
        </View>
      ) : posts.length === 0 ? (
        <View style={{ padding: 20 }}>
          <Text style={{ color: "#d4d4d4", fontSize: 16 }}>No posts found.</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TagPostCard post={item} onClick={() => console.log("Open post", item.id)} />
          )}
          contentContainerStyle={{ padding: 12 }}
        />
      )}
    </ScreenWrapper>
  );
}
