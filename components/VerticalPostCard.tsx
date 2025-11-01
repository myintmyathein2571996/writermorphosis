import { Clock, Eye } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Badge } from "./ui/Badge";

type WPPost = {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  meta?: { post_views?: number; read_time?: string };
  _embedded?: {
    author?: { id: number; name: string; avatar_urls: { [size: string]: string } }[];
    ["wp:featuredmedia"]?: { source_url: string }[];
  };
  categories?: { id: number; name: string }[];
};

interface VerticalPostCardProps {
  post: WPPost;
  onClick: () => void;
  onAuthorClick?: (authorName: string) => void;
  featured?: boolean;
  variant?: "default" | "category" | "tag" | "author";
}

export function VerticalPostCard({
  post,
  onClick,
  onAuthorClick,
  featured = false,
}: VerticalPostCardProps) {
  const imageUrl =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "https://via.placeholder.com/400";

  const author = post._embedded?.author?.[0];
  const authorName = author?.name || "Unknown";
  const authorAvatar =
    author?.avatar_urls?.["48"]?.replace(/^\/\//, "https://") ||
    "https://via.placeholder.com/48";

  const excerptText = post.excerpt?.rendered
    ? post.excerpt.rendered.replace(/<[^>]+>/g, "")
    : "";
  const postTitle = post.title?.rendered || "";
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const readTime = post.meta?.read_time || "2 min";
  const views = post.meta?.post_views || 0;
  const category = post.categories?.[0]?.name || "Uncategorized";

  return (
    <View style={[styles.card, featured && styles.featuredCard]}>
      <TouchableOpacity onPress={onClick} activeOpacity={0.8}>
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, featured && styles.featuredImage]}
        />
        <View style={styles.badgeContainer}>
          <Badge text={category} />
        </View>
        {/* <TouchableOpacity style={styles.bookmarkButton}>
          <Bookmark color="white" size={18} />
        </TouchableOpacity> */}
      </TouchableOpacity>

      <View style={styles.content}>
        <TouchableOpacity onPress={onClick}>
          <Text style={styles.title}>{postTitle}</Text>
          <Text style={styles.excerpt}>{excerptText}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <View style={styles.authorInfo}>
            {onAuthorClick ? (
              <TouchableOpacity
                style={styles.authorButton}
                onPress={() => onAuthorClick(authorName)}
              >
                <Image source={{ uri: authorAvatar }} style={styles.avatar} />
                <Text style={styles.authorName}>{authorName}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.authorButton}>
                <Image source={{ uri: authorAvatar }} style={styles.avatar} />
                <Text style={styles.authorName}>{authorName}</Text>
              </View>
            )}
            <View style={styles.infoItem}>
              <Clock size={14} color="#888" />
              <Text style={styles.infoText}>{readTime}</Text>
            </View>
          </View>

          <View style={styles.views}>
            <Eye size={14} color="#888" />
            <Text style={styles.infoText}>
              {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// styles remain the same
const styles = StyleSheet.create({
  card: { backgroundColor: "#2a2422", borderRadius: 12, marginBottom: 12, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  featuredCard: { borderWidth: 2, borderColor: "#9333ea" },
  image: { width: "100%", height: 180 },
  featuredImage: { height: 220 },
  badgeContainer: { position: "absolute", top: 8, left: 8 },
  bookmarkButton: { position: "absolute", top: 8, right: 8, backgroundColor: "rgba(46,42,43,0.7)", padding: 6, borderRadius: 20 },
  content: { padding: 12 },
  title: { color: "#f4f4f4", fontSize: 16, fontWeight: "bold" },
  excerpt: { color: "#d4d4d4", fontSize: 14, marginTop: 4 },
  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  authorInfo: { flexDirection: "row", alignItems: "center", gap: 8 },
  authorButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  avatar: { width: 20, height: 20, borderRadius: 10 },
  authorName: { color: "#d4d4d4", fontSize: 12 },
  infoItem: { flexDirection: "row", alignItems: "center", marginLeft: 8, gap: 2 },
  infoText: { color: "#888", fontSize: 12 },
  views: { flexDirection: "row", alignItems: "center", gap: 4 },
});
