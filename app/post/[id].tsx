import { incrementPostView } from "@/api/api"; // only increment API
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import AutoHeightWebView from "react-native-autoheight-webview";

// --- Type Definitions ---
interface FeaturedMedia {
  source_url: string;
}

interface Embedded {
  'wp:featuredmedia'?: FeaturedMedia[];
  author?: { name: string; avatar_urls?: { [size: string]: string } }[];
  'wp:term'?: { id: number; name: string; taxonomy: string }[][];
}

interface PostData {
  id: number;
  _embedded?: Embedded;
  featured_media_url?: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  date?: string;
  // add any other fields you may need
}

interface RouteParams {
  post: PostData; // expect post object to be passed via params
}

export default function PostDetailPage() {
  const { post } = useLocalSearchParams();
  const screenWidth = Dimensions.get('window').width;
    const postData = useMemo(() => {
    try {
      return post ? JSON.parse(post as string) : null;
    } catch (e) {
      console.error('Failed to parse post data:', e);
      return null;
    }
  }, [post]);

  useEffect(() => {
    const incrementView = async () => {
      try {
        await incrementPostView(postData.id);
      } catch (err) {
        console.error("Error incrementing post view:", err);
      }
    };
    incrementView();
  }, [postData.id]);

  const featuredImage =
    postData._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    postData.featured_media_url ||
    null;

const categories =
  postData._embedded?.['wp:term']?.[0]?.filter(
    (term: { id: number; name: string; taxonomy: string }) => term.taxonomy === 'category'
  ) || [];


  const author = postData._embedded?.author?.[0];

  return (
    <ScreenWrapper
      logoSource={require("../../assets/images/icon.png")}
      loading={false} // no fetching, so no loading
      showBackButton
      title={postData.title?.rendered || "Article"}
    >
      <View style={{ flex: 1 }}>
        {/* Featured Image */}
        {featuredImage && (
          <Image
            source={{ uri: featuredImage }}
            style={{ width: screenWidth, height: 220, marginBottom: 16 }}
            resizeMode="cover"
          />
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <View style={styles.categoriesContainer}>
            {categories.map((cat: { id: number; name: string; taxonomy: string }, index: number) => (
  <View key={cat.id ?? index} style={styles.categoryBadge}>
    <Text style={styles.categoryText}>{cat.name}</Text>
  </View>
))}

          </View>
        )}

        {/* Title */}
        <Text style={styles.postTitle}>{postData.title?.rendered}</Text>

        {/* Author Section */}
        {author && (
          <View style={styles.authorContainer}>
            {author.avatar_urls?.['48'] && (
              <Image
                source={{ uri: author.avatar_urls['48'] }}
                style={styles.authorAvatar}
              />
            )}
            <Text style={styles.authorName}>{author.name}</Text>
          </View>
        )}

        {/* WebView with horizontal padding */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <AutoHeightWebView
            source={{ uri: postData.link }}
            style={{ width: screenWidth - 32 }}
            customStyle={`body { font-size: 16px; padding: 0; margin: 0; }`}
            viewportContent={'width=device-width, initial-scale=1.0'}
            scrollEnabled={false}   // prevent double scroll
            startInLoadingState
          />
        </View>

         {/* {postData.tags?.length > 0 && (
          <View
        
          >
            {postData._embedded?.['wp:term']?.[1]?.map((tag: any) => (
              <TouchableOpacity
                key={tag.id}
                activeOpacity={0.8}
                style={{
                //   backgroundColor: theme.card,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 25,
                  marginRight: 10,
                }}
                onPress={() =>
                  router.push(`/tag/${encodeURIComponent(tag.slug)}`)
                }
              >
                <Text>#{tag.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )} */}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  categoryBadge: {
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#333',
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    color: '#555',
  },
});
