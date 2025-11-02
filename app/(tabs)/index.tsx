// import { CalendarDays, Feather } from "lucide-react-native";
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { getLatestPosts, getPopularCategories, getPopularPosts, getPopularTags } from "@/api/api";
import { CategoryScroll } from "@/components/CategoryScroll";
import { QuoteCarousel } from "@/components/QuoteCarousel";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { TrendingTags } from '@/components/TrendingTags';
import { VerticalPostCard } from "@/components/VerticalPostCard";
import { router } from 'expo-router';

export default function HomeScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
    const [trendingTags, setTrendingTags] = useState<any[]>([]);

  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [popularPosts, setPopularPosts] = useState<any[]>([]);

  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
   const [loadingTrendingTags, setLoadingTrendingTags] = useState(true);


  const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');

  const dailyQuotes = [
    { id: "1", text: "Creativity takes courage.", author: "Henri Matisse" },
    { id: "2", text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
    { id: "3", text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  ];

  // Fetch categories
  useEffect(() => {
    setLoadingCategories(true);
    getPopularCategories()
      .then((categoriesData) => setCategories(categoriesData))
      .catch((err) => console.error(err))
      .finally(() => setLoadingCategories(false));
  }, []);

   // Fetch categories
  useEffect(() => {
    setLoadingTrendingTags(true);
    getPopularTags()
      .then((tagData) => setTrendingTags(tagData))
      .catch((err) => console.error(err))
      .finally(() => setLoadingTrendingTags(false));
  }, []);

  // Fetch latest posts initially
  useEffect(() => {
    setLoadingLatest(true);
    getLatestPosts()
      .then((latestData) => setLatestPosts(latestData.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoadingLatest(false));
  }, []);

  const fetchPopularPosts = () => {
    setLoadingPopular(true);
    getPopularPosts()
      .then((popularData) => setPopularPosts(popularData.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoadingPopular(false));
  };

  const handleTabChange = (tab: 'latest' | 'popular') => {
    setActiveTab(tab);
    if (tab === 'popular' && popularPosts.length === 0) {
      fetchPopularPosts(); // fetch only when switching to popular tab
    }
  };

  const NoPosts = () => (
    <View style={styles.noPostsContainer}>
      {/* <CalendarDays size={64} color="#555" /> */}
      <Feather name="calendar" size={64} color="#555" />
      <Text style={styles.noPostsTitle}>No posts found</Text>
      <Text style={styles.noPostsText}>No posts were published on this date</Text>
    </View>
  );

const handlePostClick = (post: any) => {
  router.push({
    pathname: `/post/[id]`,
    params: {
      id: post.id,              // required
      post: JSON.stringify(post) // optional extra data
    },
  });
};


  const handleAuthorClick = (authorName: string) => console.log("Clicked author:", authorName);

  const postsToShow = activeTab === 'latest' ? latestPosts : popularPosts;
  const loadingCurrent = activeTab === 'latest' ? loadingLatest : loadingPopular;


  
  const handlePress = (slug: string) => {
    router.push({
    pathname: "/tag/[slug]",
    params: { slug },
    });

  };

  return (
    <ScreenWrapper
      logoSource={require("../../assets/images/icon.png")}
      onProfilePress={() => console.log("Profile tapped")}
      onNotificationPress={() => console.log("Notification tapped")}
      loading={loadingCategories}
      scrollable={true}
    >
      {/* <ScrollView style={{ paddingBottom: 24 }}> */}
        <QuoteCarousel quotes={dailyQuotes} />

        {!loadingCategories && (
          <CategoryScroll
            categories={categories}
            // selectedSlug={selected}
            // onSelect={setSelected}
          />
        )}

        {/* Custom Tabs */}
       <View style={styles.tabsContainer}>
  {['latest', 'popular'].map(tab => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabWrapper, activeTab === tab && styles.activeTabWrapper]}
      onPress={() => handleTabChange(tab as 'latest' | 'popular')}
    >
      <View style={styles.tabContent}>
        {/* Choose icon based on tab */}
        {tab === 'latest' ? (
           <Feather
            name="clock"
            size={16}
            color={activeTab === tab ? '#d8d3ca' : '#d8d3ca'}
            style={styles.tabIcon}
          />
        ) : (
           <Feather
            name="star"
            size={16}
            color={activeTab === tab ? '#d8d3ca' : '#d8d3ca'}
            style={styles.tabIcon}
          />
        )}
        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  ))}
</View>

        {/* Posts */}
        {loadingCurrent ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : postsToShow.length === 0 ? (
          <NoPosts />
        ) : (
          <View style={{ padding: 12 }}>
            {postsToShow.map((post, idx) => (
              <VerticalPostCard
                key={post.id}
                post={post}
                // featured={idx === 0}
                onClick={() => handlePostClick(post)}
                onAuthorClick={handleAuthorClick}
              />
            ))}
          </View>
        )}

 {!loadingTrendingTags && (
           <TrendingTags
  tags={trendingTags} // define trendingTags in your state or props
  onTagClick={(slug) => handlePress(slug)}
/>
        )}
      
      {/* </ScrollView> */}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noPostsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
  },
  noPostsText: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
    textAlign: "center",
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
    backgroundColor : '#4a3a32',
    gap: 10,
  },

  activeTabWrapper: {
    backgroundColor: '#2a2422',
     paddingVertical: 14,
  paddingHorizontal: 24,
   
  },


  tabWrapper: {
  // marginRight: 16,
// backgroundColor: '#2a2422',
     paddingVertical: 14,
  paddingHorizontal: 24,
  borderRadius: 18,
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center', // center content inside tab
},
tabContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center', // center icon + text horizontally
  
},
tabIcon: {
  marginRight: 6, // spacing between icon and text
},
tabText: {
  fontSize: 13,
  color: '#d8d3ca',
  fontWeight: '500',
},
activeTabText: {
  color: '#d8d3ca',
  fontWeight: '700',
},

});
