import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Eye } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
};

interface CategoryPostCardProps {
  post: WPPost;
  onClick: () => void;
}

export function CategoryPostCard({ post, onClick }: CategoryPostCardProps) {
  const imageUrl =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "https://via.placeholder.com/400";

  const title = post.title?.rendered || "";
  const excerpt = post.excerpt?.rendered
    ? post.excerpt.rendered.replace(/<[^>]+>/g, "")
    : "";

  const readTime = post.meta?.read_time || "2 min";
  const views = post.meta?.post_views || 0;
   const commentsCount = post.comment_count || 0;
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });


    
  
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
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => handlePostClick(post)}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.excerpt} numberOfLines={2}>
          {excerpt}
        </Text>

        <View style={styles.meta}>
          {/* <View style={styles.metaItem}>
            <Clock size={12} color="#888" />
            <Text style={styles.metaText}>{readTime}</Text>
          </View> */}
           <View style={styles.metaItem}>
            <Feather size={12} color="#888" name="message-circle"/>
            <Text style={styles.metaText}>
              {commentsCount}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Eye size={12} color="#888" />
            <Text style={styles.metaText}>
              {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}
            </Text>
          </View>
           <View style={styles.metaItem}>
            <Feather size={12} color="#888" name="calendar"/>
            <Text style={styles.metaText}>
           {formattedDate}
            </Text>
          </View>
          
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#2a2422",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 110,
    height: 110,
  },
  content: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  title: {
    color: "#f4f4f4",
    fontSize: 15,
    fontWeight: "bold",
  },
  excerpt: {
    color: "#d4d4d4",
    fontSize: 13,
    marginTop: 4,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    gap: 3,
  },
  metaText: {
    color: "#888",
    fontSize: 12,
  },
});
