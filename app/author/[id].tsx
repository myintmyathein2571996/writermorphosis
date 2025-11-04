import { getPosts } from "@/api/api";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { VerticalPostCard } from "@/components/VerticalPostCard";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function AuthorPage() {
const { id, author } = useLocalSearchParams();
const authorData = JSON.parse(author as string);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorPosts = async () => {
      try {
        const postsData = await getPosts(1, 20, { author: id });
        setPosts(postsData.data);
      } catch (err) {
        console.error("Failed to load author posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorPosts();
  }, [id]);

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
        <FlatList
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              {authorData && (
                <Image
                  source={{ uri: authorData.avatar_urls["96"] }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              )}
              <Text style={styles.authorName}>{authorData.name}</Text>
              {authorData ? (
                <Text style={styles.description}>{authorData.description}</Text>
              ) : null}
              <View style={styles.divider} />
            </View>
          }
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <VerticalPostCard post={item} key={item.id} onClick={() => null} />
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        />
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
});
