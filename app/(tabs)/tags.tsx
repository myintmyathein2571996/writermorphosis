import { getTags } from "@/api/api";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { TagCard } from "@/components/TagCard";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

export default function Tags({ navigation }: any) {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTags()
      .then(setTags)
      .finally(() => setLoading(false));
  }, []);

   const handlePress = (slug: string) => {
     router.push({
     pathname: "/tag/[slug]",
     params: { slug },
     });
 
   };

  return (
    <ScreenWrapper
      logoSource={require('../../assets/images/icon.png')}
      onProfilePress={() => console.log('Profile tapped')}
      onNotificationPress={() => console.log('Notification tapped')}
        loading={loading} 
    >
      <View style={{ padding: 16 }}>
      {tags.map((tag) => (
        <TagCard key={tag.id} tag={tag} onPress={() => handlePress(tag.slug)}/>
      ))}
      </View>
    </ScreenWrapper>
  );
}

