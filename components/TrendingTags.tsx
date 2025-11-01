// TrendingTags.tsx
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Tag {
  id: string | number;
  name: string;
  slug: string;
  count: number;
}

interface TrendingTagsProps {
  tags: Tag[];
  onTagClick: (slug: string) => void;
}

export const TrendingTags: React.FC<TrendingTagsProps> = ({ tags, onTagClick }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Feather name="trending-up" size={20} color="#d2884a" />
        </View>
        <Text style={styles.headerText}>Trending Tags</Text>
      </View>
      <View style={styles.tagsContainer}>
        {tags.slice(0, 8).map((tag, index) => (
          <TouchableOpacity
            key={tag.id}
            onPress={() => onTagClick(tag.slug)}
            style={[
              styles.tagButton,
              { backgroundColor: index % 2 === 0 ? '#fff' : 'rgba(210, 136, 74, 0.1)' },
            ]}
          >
            <Text style={styles.tagText}>
              <Text style={{ color: '#d2884a' }}>#</Text>
              {tag.name}{" "}
              <Text style={styles.tagCount}>{tag.count}</Text>
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 12,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: '#ccc',
    backgroundColor: 'rgba(210, 136, 74, 0.15)',
    // borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  iconWrapper: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(210, 136, 74, 0.2)',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d2884a33',
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#333',
  },
  tagCount: {
    fontSize: 12,
    backgroundColor: 'rgba(210, 136, 74, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    color: '#d2884a',
  },
});
