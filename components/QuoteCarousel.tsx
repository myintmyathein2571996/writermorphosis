import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

interface Quote {
  id: string;
  text: string;
  author: string;
}

interface QuoteCarouselProps {
  quotes: Quote[];
}

export const QuoteCarousel: React.FC<QuoteCarouselProps> = ({ quotes }) => {
  return (
    <LinearGradient
      colors={[
        "rgba(210, 136, 74, 0.15)",
        "rgba(139, 111, 61, 0.1)",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <View style={styles.carouselWrapper}>
        <Carousel
          width={width * 0.9} // slightly smaller than screen
          height={100}
          data={quotes}
          autoPlay
          autoPlayInterval={6000}
          scrollAnimationDuration={1000}
          loop
          style={styles.carousel}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                
                <MaterialCommunityIcons name="format-quote-close-outline" size={42} color="#d2884a" />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.quoteText} numberOfLines={2}>"{item.text}"</Text>
                <Text style={styles.authorText}>— {item.author}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    width: "100%",
    paddingVertical: 20,
    // alignItems: "center",
    // justifyContent: "center",
    // borderRadius: 16,
  },
  carouselWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  carousel: {
    alignSelf: "center",
  },
  card: {
    width: width * 0.85,
    backgroundColor: "#2a2422", // var(--thunder)
    borderWidth: 1,
    borderColor: "#d2884a", // var(--accent-orange-warm)
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  quoteText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#d8d3ca", // var(--pampas)
    marginBottom: 6,
  },
  authorText: {
    fontSize: 12,
    color: "#d2884a", // var(--header-bg)
  },
});
