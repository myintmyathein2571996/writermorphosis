import { ScreenWrapper } from "@/components/ScreenWrapper";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { MobilePostCard } from "../components/MobilePostCard";
// import { Button } from "../components/ui/button";
// import { Badge } from "../components/ui/badge";
import { VerticalPostCard } from "@/components/VerticalPostCard";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { getPosts } from "../api/api"; // <-- Import your API function
// import { BlogPost } from "../types/blog";


export default function RandomPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [randomPosts, setRandomPosts] = useState<any[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await getPosts(1, 50); // Fetch latest 50 posts
      setPosts(res.data);
      // Initialize random posts
      shufflePosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Shuffle posts
  const shufflePosts = (sourcePosts = posts) => {
    setIsShuffling(true);
    const shuffled = [...sourcePosts].sort(() => Math.random() - 0.5).slice(0, 10);
    setRandomPosts(shuffled);
    setTimeout(() => setIsShuffling(false), 200);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostClick = (post: any) => {
    router.push({
      pathname: `/post/[id]`,
      params: {
        id: post.id,              // required
        post: JSON.stringify(post) // optional extra data
      },
    });
  };

  return (
    <ScreenWrapper
      logoSource={require("../assets/images/icon.png")}
      title="RANDOM POSTS"
      showBackButton
      scrollable
        loading={loading}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTitle}>
              {/* <Shuffle style={styles.shuffleIcon} /> */}
              <Feather name="shuffle" size={20} style={styles.shuffleIcon}/>
              <Text style={styles.headerText}>Random Posts</Text>
            </View>
            <TouchableOpacity
              onPress={() => shufflePosts()}
              disabled={isShuffling || loading}
              style={styles.shuffleButton}
            >
              {/* <RefreshCcwIcon style={[styles.refreshIcon, isShuffling && styles.spin]} /> */}
              <Feather name="refresh-cw" style={styles.refreshIcon} size={12}/>
                <Text style = {{color : '#d8d3ca' , fontSize : 12}}>Shuffle</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>
            Discover something new! Tap shuffle to get a fresh set of random posts.
          </Text>
        </View>

        {/* Counter */}
        <View style={styles.counter}>
          <View style={styles.counterLeft}>
            <Feather name="shuffle" size={20} style={styles.shuffleIcon}/>
            <Text style={styles.counterText}>Showing {randomPosts.length} random posts</Text>
          </View>
          {/* <Badge>{posts.length} Total</Badge> */}
        </View>

        {/* Posts List */}
        <View style={[styles.postList, isShuffling && styles.opacityReduced]}>
          {randomPosts.map((post) => (
            <VerticalPostCard
              key={post.id}
              post={post}
              onClick={() => handlePostClick(post)}
            />
          ))}
        </View>

        {/* Info Card */}
        {/* <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            <Shuffle style={styles.infoIcon} />
            About Random Posts
          </Text>
          <Text style={styles.infoText}>
            Every time you shuffle, you'll get a completely random selection of posts from our collection.
          </Text>
        </View> */}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { 
    paddingBottom: 16, 
    // backgroundColor: "#1e1a18",
  },
  header: { 
    padding: 16, 
    // marginBottom: 12, 
    backgroundColor: "#2a2422", // matches CategoryCard bg
    // borderRadius: 12,
  },
  headerTop: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 8 
  },
  headerTitle: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8
  },
  shuffleIcon: { 
    // width: 32, 
    // height: 32,  
    color: "#d8d3ca" // matches CategoryCard text color
  },
  headerText: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#d8d3ca" 
  },
  headerSubtitle: { 
    marginTop: 4, 
    fontSize: 14, 
    color: "#a59d94" // matches CategoryCard count text
  },
  shuffleButton: { 
    flexDirection: "row", 
    alignItems: "center",
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#d8d3ca",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  refreshIcon: { 
    // width: 16, 
    // height: 16, 
    marginRight: 6, 
    color: "#d8d3ca"
  },
  spin: { /* Add Animated spinning if needed */ },
  counter: { 
    padding: 12, 
    borderBottomWidth: 1, 
    borderColor: "#3d3330", // matches CategoryCard border
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  counterLeft: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 6 
  },
  counterIcon: { 
    width: 20, 
    height: 20, 
    color: "#d8d3ca"
  },
  counterText: { 
    fontSize: 14, 
    color: "#d8d3ca"
  },
  postList: { 
    borderTopWidth: 1, 
    borderColor: "#3d3330", 
    padding : 16,
  },
  opacityReduced: { 
    opacity: 0.5 
  },
  infoCard: { 
    padding: 16, 
    marginTop: 12, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: "#3d3330", 
    backgroundColor: "#2a2422" 
  },
  infoTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 6, 
    flexDirection: "row", 
    alignItems: "center", 
    color: "#d8d3ca",
  
  },
  infoIcon: { 
    width: 20, 
    height: 20, 
    marginRight: 6,
    color: "#d8d3ca"
  },
  infoText: { 
    fontSize: 14, 
    color: "#a59d94"
  },
});
