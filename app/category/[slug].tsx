import { getCategories, getPostsByCategory } from "@/api/api";
import { CategoryPostCard } from "@/components/CategoryPostCard";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function CategoryPage() {
  const { slug } = useLocalSearchParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<any>(null);


  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const allCategories = await getCategories();
        const foundCategory = allCategories.find((c: any) => c.slug === slug);

        if (foundCategory) {
          setCategory(foundCategory);
          const postsData = await getPostsByCategory(foundCategory.id);
          setPosts(postsData);
        } else {
          setCategory({ name: "Not Found", description: "This category doesn't exist." });
        }
      } catch (err) {
        console.error("Failed to load category posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

const renderHeader = () => {
  if (!category) return null;
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.categoryTitle}>{category.name}</Text>
      
      {/* Post count */}
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{category.count} posts</Text>
      </View>

      {/* Description */}
      {category.description ? (
        <Text style={styles.categoryDescription}>
          {category.description.replace(/<\/?[^>]+(>|$)/g, "")}
        </Text>
      ) : (
        <Text style={styles.categoryDescription}>No description available.</Text>
      )}
    </View>
  );
};

  return (
    <ScreenWrapper
      logoSource={require("../../assets/images/icon.png")}
      loading={loading}
      showBackButton
      title="Categorized"
      scrollable={false}
    >
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#f5f2eb" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CategoryPostCard post={item} onClick={() => {}} />
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No posts found in this category.</Text>
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
  categoryTitle: {
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
  categoryDescription: {
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
