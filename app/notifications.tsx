import { ScreenWrapper } from "@/components/ScreenWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";



export default function NotificationPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem("notifications");
      if (stored) {
        const parsed: any[] = JSON.parse(stored);
        // console.log(parsed);
        
        setNotifications(parsed);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const clearNotifications = async () => {
    await AsyncStorage.removeItem("notifications");
    setNotifications([]);
  };

  const openPost = (post : any) => {
   
    // console.log(post.data.id);
    
    //  router.push({
    //     pathname: `/post/[id]`,
    //     params: {
    //       id: post.data.id,              
    //       post: JSON.stringify(post.data) 
    //     },
    //   });
  };

  return (
    <ScreenWrapper
      logoSource={require("../assets/images/icon.png")}
      title="NOTIFICATIONS"
      showBackButton
      scrollable={false}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={clearNotifications} style={styles.clearBtn}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>

        {notifications.length === 0 ? (
          <Text style={styles.empty}>No notifications yet.</Text>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => openPost(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.body}>{item.body}</Text>
                <Text style={styles.time}>
                  {new Date(item.time).toLocaleString()}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1a18",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: "#2a2422",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#4b3f39",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    color: "#e0d8cf",
    marginBottom: 6,
  },
  body: {
    color: "#b8aca3",
    fontSize: 14,
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: "#8e8278",
    textAlign: "right",
  },
  clearBtn: {
    alignSelf: "flex-end",
    marginBottom: 10,
    backgroundColor: "#3a322e",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearText: {
    color: "#ff6b6b",
    fontSize: 13,
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    marginTop: 60,
    color: "#b5a99e",
    fontSize: 15,
  },
});
