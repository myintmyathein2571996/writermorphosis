// app/post/[id].tsx

// import HorizontalLatestPostCard from '@/components/HorizontalPostCard';
// import { useTheme } from '@/context/ThemeContext';
import CommentsSection from '@/components/CommentsSection';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { Badge } from '@/components/ui/Badge';
import { VerticalPostCard } from '@/components/VerticalPostCard';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import RenderHtml from 'react-native-render-html';

export default function PostDetailScreen() {
  const { post } = useLocalSearchParams();
  const router = useRouter();
  // const colorScheme = useColorScheme();
  // const {theme} = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [authorPosts, setAuthorPosts] = useState<any[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const API_BASE = "https://writermorphosis.com/wp-json/wp/v2";







  const postData = useMemo(() => {
    try {
      return post ? JSON.parse(post as string) : null;
    } catch (e) {
      console.error('Failed to parse post data:', e);
      return null;
    }
  }, [post]);

  if (!postData) {
    return (
       <ScreenWrapper
      logoSource={require("../../assets/images/icon.png")}
      loading={false} // no fetching, so no loading
      showBackButton
    >
        <Text style={{ color: '#d8d3ca', textAlign: 'center', marginTop: 50 }}>No post data available</Text>
      </ScreenWrapper>
    );
  }

  const featuredImage =
    postData._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    postData.featured_media_url ||
    null;

  const author = postData._embedded?.author?.[0];
  const authorName = author?.name || "Unknown Author";
  const rawAvatar = author?.avatar_urls?.["24"] || "";
  const authorAvatar = rawAvatar
    ? rawAvatar.replace(/^\/\//, "https://").replace(/&#038;/g, "&")
    : "https://via.placeholder.com/24.png?text=A";
  const postDate = new Date(postData.date).toLocaleDateString();
  const commentCount = postData.comment_count ?? 0;
  const views = postData?.meta?.post_views ?? 0;

 const categories =
  postData._embedded?.["wp:term"]?.[0]?.filter(
    (term: { id: number; name: string; taxonomy: string }) =>
      term.taxonomy === "category"
  ) || [];

const category = categories[0]?.name || "Uncategorized";

const tagsStyles: Record<string, any> = {
  body: {
    backgroundColor: '#fcf5eb', // light body background
    color: '#2d241e',
    fontSize: 16,
    lineHeight: 26,
    padding: 8,
    borderRadius: 8,
  },
  p: { marginBottom: 12 },
  h1: {
    fontSize: 28,
    marginVertical: 12,
    color: '#1e1a18',
    fontWeight: '700',
  },
  h2: {
    fontSize: 24,
    marginVertical: 10,
    color: '#3b302a',
    fontWeight: '700',
  },
  h3: {
    fontSize: 20,
    marginVertical: 8,
    color: '#4e4037',
    fontWeight: '600',
  },
  a: {
    color: '#b36b2e',
    textDecorationLine: 'underline' as 'underline',
    fontWeight: '500',
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#b36b2e',
    paddingLeft: 12,
    color: '#6d5d52',
    fontStyle: 'italic',
    marginVertical: 16,
    backgroundColor: '#f9efe2',
    borderRadius: 6,
  },
  img: {
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9,
    marginVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0d4c8',
  },
  iframe: {
    width: '100%',
    height: 200,
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0d4c8',
  },
};


  useEffect(() => {
    const fetchData = async () => {
      const catRes = await fetch(`${API_BASE}/categories`);
      const catData = await catRes.json();
      if (category) {
        const reordered = [
          ...catData.filter((c: any) => c.slug === category.slug),
          ...catData.filter((c: any) => c.slug !== category.slug),
        ];
        setCategoriesList(reordered);
      } else {
        setCategoriesList(catData);
      }

      if (author) {
        const authorRes = await fetch(`${API_BASE}/posts?author=${author.id}&per_page=3&_embed`);
        const authorData = await authorRes.json();
        setAuthorPosts(authorData);
      }

      if (category) {
        const relatedRes = await fetch(`${API_BASE}/posts?categories=${category.id}&per_page=5&_embed`);
        let relatedData = await relatedRes.json();
        if(relatedData && relatedData.length > 0){
 relatedData = relatedData.filter((p: any) => p.id !== postData.id);
        setRelatedPosts(relatedData);
        }
       
      }
    };
    fetchData();
  }, [category, author, postData.id]);

  const handleLinkPress = async (href: string) => {
  // Example: open link in browser
  if (href) {
    await Linking.openURL(href);
  }
};



   const handleCatPress = (slug: string , name : string) => {
    router.push({
    pathname: "/category/[slug]",
    params: { slug , name },
    });

    console.log(slug);
    

  };

  const handlePostClick = (post: any) => {
    router.push({
      pathname: `/post/[id]`,
      params: {
        id: post.id,              // required
        post: JSON.stringify(post) // optional extra data
      },
    });
  };

   const handleAuthorClick = ( id : number , author : any) => {
    router.push({
      pathname: `/author/[id]`,
      params: {
      id : id,              // required
        author : JSON.stringify(author) // optional extra data
      },
    });
  };

  return (
   <ScreenWrapper
      logoSource={require("../../assets/images/icon.png")}
      loading={false} // no fetching, so no loading
      showBackButton
      title={"Article"}
    >
     

      <ScrollView contentContainerStyle={styles.contentContainer }>

          {/* Featured Image */}
        {featuredImage && (
          <Image
            source={{ uri: featuredImage }}
            style={{ width: screenWidth , height: 220 , marginBottom: 16 }}
            resizeMode="cover"
          />
        )}

         <Pressable style={{ paddingHorizontal: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' }} onPress={() => handleCatPress(categories[0]?.slug, categories[0]?.name )}>
                  <Badge text={category} />
                </Pressable>


        <Text style={[styles.title, { color: '#d8d3ca', paddingHorizontal : 16 }]}>{postData.title.rendered}</Text>

        {/* Meta Row */}

        <View style={[styles.metaRow, {  paddingHorizontal : 16 }]}>
          <View style={styles.metaItem}>
            <Feather name="clock" size={16} color={'#a59d94'} style={styles.metaIcon} />
            <Text style={[styles.metaText, { color: '#a59d94' }]}>{String(postDate)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="message-circle" size={16} color={'#a59d94'} style={styles.metaIcon} />
            <Text style={[styles.metaText, { color: '#a59d94' }]}>{String(commentCount)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="eye" size={16} color={'#a59d94'} style={styles.metaIcon} />
            <Text style={[styles.metaText, { color: '#a59d94' }]}>{String(views)}</Text>
          </View>
        </View>

        {/* Author */}
        {/* Categories */}
       {/* <CategoryScroll  categories={categories}/> */}

      

  {/* <AutoHeightWebView
    source={{ uri: postData.link }}
    style={{ width: screenWidth - 32 }}
    customStyle={`body { font-size: 16px; padding: 0; margin: 0; }`}
    viewportContent={'width=device-width, initial-scale=1.0'}

    scrollEnabled={false}   // important: prevent double scroll
    startInLoadingState
   renderLoading={() => (
    <View style={[styles.loader, { backgroundColor: '#CFC' }]}>
      <ActivityIndicator size="large" color={'red'} />
    </View>
  )}
  /> */}
   <View style={{ paddingHorizontal: 16, flex: 1 }}>
     <RenderHtml
          contentWidth={screenWidth}
          source={{ html: postData.content.rendered }}
          tagsStyles={tagsStyles}
         renderersProps={{
    a: {
      onPress: (_, href: string) => handleLinkPress(href),
    },
  }}
        />
   </View>

      


        {/* Tags */}
        {postData.tags?.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 16 , paddingHorizontal: 16 }}
          >
            {postData._embedded?.['wp:term']?.[1]?.map((tag: any) => (
              <TouchableOpacity
                key={tag.id}
                activeOpacity={0.8}
                style={{
                  backgroundColor: '#2f2926',
                  borderColor : 'rgba(224, 169, 109, 0.6)',
                  borderWidth: 1,
                    paddingVertical: 6,
    paddingHorizontal: 12,
                  borderRadius: 8,
                  marginRight: 10,
                }}
                onPress={() =>
                  router.push(`/tag/${encodeURIComponent(tag.slug)}`)
                }
              >
                <Text style={{ color: '#d8d3ca', fontSize: 12 }}>#{tag.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

 <View style={[styles.separator, { backgroundColor: 'gray' }]} />
          <View style = {{ paddingHorizontal: 16, marginTop: 16, marginBottom: 32 }}>
            <CommentsSection postId={postData.id} />
          </View>



        {author && (
          <>
            <View style={[styles.separator, { backgroundColor: 'gray' }]} />
            <View style={styles.sectionContainer}>

              <Text style={[styles.sectionTitle, { color: '#d8d3ca' }]}>About the Author</Text>
              <View style={[styles.authorRow, { backgroundColor: '#2f2926', padding: 12, borderRadius: 10 }]}>
                {author.avatar_urls && (
                  <Image
                    source={{ uri: author.avatar_urls[96] }}
                    style={{ width: 60, height: 60, borderRadius: 30, marginRight: 12 }}
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#d8d3ca' }}>{author.name}</Text>
                  {author.description && <Text style={{ color: '#a59d94' }}>{author.description}</Text>}
                </View>

              </View>

              {authorPosts.map((p) => (
                <VerticalPostCard post={p}  key={p.id} onClick={() => handlePostClick(p)}/>
              ))}

               <TouchableOpacity onPress={() => handleAuthorClick(author.id, author)} style={{   alignItems: 'center', marginTop: 10, marginBottom: 20, borderColor : 'rgba(224, 169, 109, 0.6)', borderWidth: 1, padding: 10, borderRadius: 8 }}>
              <Text style={{ color: '#d8d3ca' }}>See More Posts from author</Text>
            </TouchableOpacity>
            </View>


           
          </>
        )}


        {relatedPosts.length > 0 && (
          <>
            <View style={[styles.separator, { backgroundColor: 'gray' }]} />
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: '#d8d3ca' }]}>Related Posts</Text>

              </View>
              {relatedPosts.map((p) => (
                <VerticalPostCard post={p}  key={p.id} onClick={() => handlePostClick(p)}/>
              ))}
            </View>
            <TouchableOpacity onPress={() =>
              // router.push(
                
              //   `/explore/${encodeURIComponent(category.slug)}?name=${encodeURIComponent(category.name)}`
              // )
              handleCatPress(category.slug , category.name )
            } style={{ alignItems: 'center', marginTop: 10, marginBottom: 20, borderColor: 'red', borderWidth: 1, padding: 10, borderRadius: 8 }}>
              <Text style={{ color: '#d8d3ca' }}>See More from {category.name}</Text>
            </TouchableOpacity>
          </>
        )}

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { padding: 6 },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    marginTop: 20,
    width: "100%",
  },
  contentContainer: {  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 10,
    lineHeight: 38,
  },
  authorRowFull: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  metaIcon: { marginRight: 4 },
  metaText: { fontSize: 14 },
  categoryScroll: { marginBottom: 8 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, marginRight: 10 },
  categoryText: { fontSize: 14 },
  sectionContainer: { marginTop: 32, marginBottom: 16 , paddingHorizontal: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});
