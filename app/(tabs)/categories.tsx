import { getCategories } from "@/api/api";
import { CategoryCard } from "@/components/CategoryCard";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

export default function Categories({ navigation }: any) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);


    const handlePress = (slug: string , name : string) => {
    router.push({
    pathname: "/category/[slug]",
    params: { slug , name},
    });

  };

  return (
    <ScreenWrapper
      logoSource={require('../../assets/images/icon.png')}
      // onProfilePress={() => console.log('Profile tapped')}
      // onNotificationPress={() => console.log('Notification tapped')}
        loading={loading} 
    >
      <View style={{ padding: 16 }}>
       {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} onPress={() => handlePress(cat.slug, cat.name)}/>
      ))}
      </View>
     
     
    </ScreenWrapper>
  );
}
