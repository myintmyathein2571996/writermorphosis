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
  onTagClick: (slug: string , id : number) => void;
}

export const TrendingTags: React.FC<TrendingTagsProps> = ({ tags, onTagClick }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Feather name="trending-up" size={20} color="#e0a96d" />
        </View>
        <Text style={styles.headerText}>Trending Tags</Text>
      </View>
      <View style={styles.tagsContainer}>
        {tags.slice(0, 8).map((tag) => (
          <TouchableOpacity
            key={tag.id}
            onPress={() => onTagClick(tag.slug , tag.id)}
            style={styles.tagButton}
          >
            <Text style={styles.tagText}>
              <Text style={{ color: '#c6b8a6' }}>#</Text>
              {tag.name}{' '}
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
    backgroundColor: 'rgba(60, 50, 45, 0.6)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(224, 169, 109, 0.2)',
    // borderRadius: 10,
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
    backgroundColor: 'rgba(224, 169, 109, 0.15)',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1e7d6',
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
    borderColor: 'rgba(224, 169, 109, 0.6)',
    backgroundColor: '#2b2523',
  },
  tagText: {
    fontSize: 14,
    color: '#e8dfcf',
  },
  tagCount: {
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    color: '#e0a96d',
  },
});
