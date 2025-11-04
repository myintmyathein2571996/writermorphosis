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
  count: number;
}

interface CategoryScrollProps {
  categories: Category[];
}

export const CategoryScroll: React.FC<CategoryScrollProps> = ({ categories }) => {
  const router = useRouter();

  const handlePress = (slug: string , name : string) => {
    router.push({
    pathname: "/category/[slug]",
    params: { slug , name},
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
            onPress={() => handlePress(category.slug , category.name)}
            activeOpacity={0.8}
          >
            <Text style={styles.badgeText}>{category.name}</Text>
            <Text style={styles.catCount}>{category.count}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e1a18",
    // borderBottomWidth: 1,
    // borderColor: "#4b4643",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  scrollContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    // borderWidth: 1,
    // borderColor: "#4b4643",
    // borderRadius: 20,
    // paddingVertical: 6,
    // paddingHorizontal: 14,
    // backgroundColor: "transparent",
        paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(224, 169, 109, 0.6)',
    backgroundColor: '#2b2523',
     flexDirection: 'row',
  },
  badgeText: {
    fontSize: 14,
    color: "#f5f2eb",
  },
    catCount: {
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    color: '#e0a96d',
  },
});
