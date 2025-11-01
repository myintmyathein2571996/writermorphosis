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
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
}

export const CategoryScroll: React.FC<CategoryScrollProps> = ({
  categories,
  selectedSlug,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* "All" badge */}
        {/* <TouchableOpacity
          style={[
            styles.badge,
            selectedSlug === null && styles.badgeActive,
          ]}
          onPress={() => onSelect(null)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.badgeText,
              selectedSlug === null && styles.badgeTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity> */}

        {/* Category badges */}
        {categories.slice(0, 6).map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.badge,
              selectedSlug === category.slug && styles.badgeActive,
            ]}
            onPress={() => onSelect(category.slug)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.badgeText,
                selectedSlug === category.slug && styles.badgeTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e1a18", // var(--content-bg)
    borderBottomWidth: 1,
    borderColor: "#4b4643", // var(--tundora)
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
    borderColor: "#4b4643", // outline color
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "transparent",
  },
  badgeActive: {
    backgroundColor: "#d2884a", // accent orange
    borderColor: "#d2884a",
  },
  badgeText: {
    fontSize: 14,
    color: "#f5f2eb", // var(--pampas)
  },
  badgeTextActive: {
    color: "#1e1a18", // dark text when active
    fontWeight: "600",
  },
});
