import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryScrollProps {
  categories: Category[];
}

export const CategoryScroll: React.FC<CategoryScrollProps> = ({ categories }) => {
  const router = useRouter();

  const handlePress = (slug: string) => {
    router.push({
    pathname: "/category/[slug]",
    params: { slug },
    });

  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.slice(0, 6).map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.badge}
            onPress={() => handlePress(category.slug)}
            activeOpacity={0.8}
          >
            <Text style={styles.badgeText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e1a18",
    borderBottomWidth: 1,
    borderColor: "#4b4643",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  scrollContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    borderWidth: 1,
    borderColor: "#4b4643",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "transparent",
  },
  badgeText: {
    fontSize: 14,
    color: "#f5f2eb",
  },
});
