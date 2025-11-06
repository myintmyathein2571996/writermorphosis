import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Eye } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Badge } from "./ui/Badge";

type WPPost = {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  comment_count: number;
  date: string;
  meta?: { post_views?: number; read_time?: string };
  _embedded?: {
    ["wp:featuredmedia"]?: { source_url: string }[];
  };
  tags?: { id: number; name: string }[];
};

interface TagPostCardProps {
  post: WPPost;
  onClick: () => void;
}

export function TagPostCard({ post, onClick }: TagPostCardProps) {
  const imageUrl =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "https://via.placeholder.com/400";

  const excerptText = post.excerpt?.rendered
    ? post.excerpt.rendered.replace(/<[^>]+>/g, "")
    : "";

  const postTitle = post.title?.rendered || "";
    const commentsCount = post.comment_count || 0;
  const readTime = post.meta?.read_time || "2 min";
  const views = post.meta?.post_views || 0;
  // const tagName = post.tags?.[0]?.name || "General";
  const categories =
  post._embedded?.["wp:term"]?.[0]?.filter(
    (term: { id: number; name: string; taxonomy: string ; slug : string}) =>
      term.taxonomy === "category"
  ) || [];

const category = categories[0]?.name || "Uncategorized";

     const handleCatPress = (slug: string , name : string) => {
    router.push({
    pathname: "/category/[slug]",
    params: { slug , name },
    });

    console.log(slug);
    

  };

  const handlePostClick = (post: any) => {
  router.push({
    pathname: `/post/[id]`,
    params: {
      id: post.id,              
      post: JSON.stringify(post) // optional extra data
    },
  });
};

  return (
    <TouchableOpacity style={styles.card} onPress={() => handlePostClick(post)} activeOpacity={0.8}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
 <TouchableOpacity onPress={() => handleCatPress(categories[0]?.slug ,category)} activeOpacity={0.8} style={{ position: "absolute", top: 10, left: 10 }}>
                  <Badge text={category} />
                </TouchableOpacity>
      <View style={styles.content}>
        {/* <View style={styles.tagContainer}>
          <Tag size={14} color="#d2884a" />
          <Text style={styles.tagText}>{category}</Text>
        </View> */}

       

        <Text style={styles.title} numberOfLines={2}>
          {postTitle}
        </Text>

        <Text style={styles.excerpt} numberOfLines={2}>
          {excerptText}
        </Text>

        <View style={styles.footer}>
          {/* <View style={styles.infoItem}>
            <Clock size={13} color="#888" />
            <Text style={styles.infoText}>{readTime}</Text>
          </View> */}
           <View style={styles.infoItem}>
            <Feather size={13} color="#888" name="message-circle"/>
            <Text style={styles.infoText}>
              {commentsCount}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Eye size={13} color="#888" />
            <Text style={styles.infoText}>
              {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}
            </Text>
          </View>

        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2a2422",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 160,
    position: "relative",
  },
  content: {
    padding: 12,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  tagText: {
    color: "#d2884a",
    fontSize: 13,
    fontWeight: "500",
  },
  title: {
    color: "#f4f4f4",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  excerpt: {
    color: "#d4d4d4",
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    color: "#999",
    fontSize: 12,
  },
});
