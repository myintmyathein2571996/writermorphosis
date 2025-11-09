import { router } from "expo-router";
import { Eye, MessageCircle } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Badge } from "./ui/Badge";

type WPPost = {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  comment_count: number;
  date: string;
  author_custom_avatar?: string;
  meta?: { post_views?: number; read_time?: string };
  _embedded?: {
    author?: {
      id: number;
      name: string;
      avatar_urls: { [size: string]: string };
    }[];
    ["wp:featuredmedia"]?: { source_url: string }[];
    ["wp:term"]?: {
      id: number;
      name: string;
      taxonomy: string;
      slug: string;
    }[][];
    
  };
  categories?: { id: number; name: string }[];
};


interface VerticalPostCardProps {
  post: WPPost;
  // onClick: () => void;
  // onAuthorClick?: (authorName: string) => void;
  featured?: boolean;
  variant?: "default" | "category" | "tag" | "author";
}

export function VerticalPostCard({
  post,
  // onClick,
  // onAuthorClick,
  featured = false,
}: VerticalPostCardProps) {
  const imageUrl =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "https://via.placeholder.com/400";

  const author = post._embedded?.author?.[0];
  const authorName = author?.name || "Unknown";
  const defaultAvatar = require("../assets/images/noprofile.png");
  // const authorAvatar =
  //   post?.author_custom_avatar;


  

  const excerptText = post.excerpt?.rendered
    ? post.excerpt.rendered.replace(/<[^>]+>/g, "")
    : "";
  const postTitle = post.title?.rendered || "";
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  // const readTime = post.meta?.read_time || "2 min";
  const views = post.meta?.post_views || 0;
  const commentsCount = post.comment_count || 0;
  // const category = post.categories?.[0]?.name || "Uncategorized";

// Extract categories from embedded terms
const categories =
  post._embedded?.["wp:term"]?.[0]?.filter(
    (term: { id: number; name: string; taxonomy: string ; slug : string}) =>
      term.taxonomy === "category"
  ) || [];

const category = categories[0]?.name || "Uncategorized";

   const handleAuthorClick = ( id : number , author : any) => {
    router.push({
      pathname: `/author/[id]`,
      params: {
      id : id,              // required
        author : JSON.stringify(author) // optional extra data
      },
    });
  };

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
    <TouchableOpacity style={[styles.card, featured && styles.featuredCard]} activeOpacity={0.8} onPress={() => handlePostClick(post)}>
   
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, featured && styles.featuredImage]}
        />
     
           <TouchableOpacity onPress={() => handleCatPress(categories[0]?.slug ,category)} activeOpacity={0.8} style={styles.badgeContainer}>
          <Badge text={category} />
        </TouchableOpacity>
     

      {/* </TouchableOpacity> */}

      <View style={styles.content}>
        {/* <TouchableOpacity onPress={onClick}> */}
          <Text style={styles.title}>{postTitle}</Text>
          <Text style={styles.excerpt} numberOfLines={3}>{excerptText}</Text>
        {/* </TouchableOpacity> */}

       <View style={styles.footer}>

{author?.id && (
  <View style={styles.authorInfo}>
   
      <TouchableOpacity
        style={styles.authorButton}
        onPress={() => handleAuthorClick(author?.id,author)}
      >
       <Image source={post?.author_custom_avatar ? { uri: post.author_custom_avatar } : defaultAvatar } style={styles.avatar} />

        <Text style={styles.authorName}>{authorName}</Text>
      </TouchableOpacity>
  </View>
  )}
   

  {/* move comments + views together on right */}
  <View style={styles.statsRow}>
    <View style={styles.infoItem}>
      <MessageCircle size={14} color="#888" />
      <Text style={styles.infoText}>{commentsCount}</Text>
    </View>
    <View style={styles.infoItem}>
      <Eye size={14} color="#888" />
      <Text style={styles.infoText}>
        {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}
      </Text>
    </View>
  </View>
</View>

      </View>
    </TouchableOpacity>
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
  statsRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
},

});
