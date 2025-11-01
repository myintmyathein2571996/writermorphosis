import Feather from "@expo/vector-icons/Feather";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    count: number;
  };
  onPress?: (category: any) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(category)}
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <View style={styles.iconWrapper}>
          <Feather name="folder" size={20} color="#d8d3ca" />
        </View>
        <View>
          <Text style={styles.title}>{category.name}</Text>
          <Text style={styles.count}>{category.count} articles</Text>
        </View>
      </View>
      <SimpleLineIcons name="arrow-right" size={20} color="#d8d3ca" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "#2a2422", 
    borderColor: "#3d3330", 
    marginBottom: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, 
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#3d3330",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#d8d3ca",
  },
  count: {
    fontSize: 14,
    color: "#a59d94", 
  },

});
