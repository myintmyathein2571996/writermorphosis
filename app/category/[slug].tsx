import { getCategories, getPostsByCategory } from "@/api/api";
import { CategoryPostCard } from "@/components/CategoryPostCard";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

export default function CategoryPage() {
  const { slug , name } = useLocalSearchParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>("");

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Find category by slug
        const allCategories = await getCategories();
        const category = allCategories.find((c: any) => c.slug === slug);

        if (category) {
          setCategoryName(category.name);
          const postsData = await getPostsByCategory(category.id);
          setPosts(postsData);
        } else {
          setCategoryName("Not Found");
        }
      } catch (err) {
        console.error("Failed to load category posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

  return (
    <ScreenWrapper
      logoSource={require("../../assets/images/icon.png")}
      loading={loading}
      showBackButton
      title={(name as string) || (categoryName as string)?.toUpperCase()}
      scrollable={false}
    >
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#f5f2eb" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CategoryPostCard post={item} onClick={() => {}} />
          )}
          contentContainerStyle={{ padding: 12 }}
        />
      )}
    </ScreenWrapper>
  );
}
