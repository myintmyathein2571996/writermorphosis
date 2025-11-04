import { ScreenWrapper } from "@/components/ScreenWrapper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar, Clock } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

interface WikiEvent {
  text: string;
  year: number;
  pages?: Array<{
    title: string;
    extract: string;
    thumbnail?: { source: string };
  }>;
}

interface WikiResponse {
  selected?: WikiEvent[];
  events?: WikiEvent[];
  births?: WikiEvent[];
  deaths?: WikiEvent[];
}

export default function History({ navigation }: any) {
  const [data, setData] = useState<WikiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "events", title: "Events" },
    { key: "births", title: "Births" },
    { key: "deaths", title: "Deaths" },
  ]);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");

      const response = await fetch(
        `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`,
        {
          headers: {
            "User-Agent": "MyReactNativeApp/1.0 (contact@example.com)",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok)
        throw new Error(`Failed to fetch history data (status ${response.status})`);

      const json = await response.json();

      const KEYWORDS = ["philosopher", "author", "writer", "poet", "novelist"];
      const filterByKeyword = (arr: WikiEvent[] | undefined) =>
        arr?.filter((i) =>
          KEYWORDS.some((k) => i.text.toLowerCase().includes(k))
        ) || [];

      setData({
        selected: filterByKeyword(json.selected),
        events: json.events || [],
        births: json.births || [],
        deaths: json.deaths || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  

  const renderEvent = ({ item, index }: { item: WikiEvent; index: number }) => {
    const page = item.pages?.[0];
    const yearsAgo = selectedDate.getFullYear() - item.year;
  // 

    return (
      <View
        key={index}
        style={{
          marginBottom: 16,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: "#2a2422",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        }}
      >


        <View style={{ padding: 16 }}>
          <Text style={{ color: "#d2884a", fontWeight: "bold", marginBottom: 4 }}>
            {yearsAgo} years ago 
          </Text>
          <Text style={{ color: "#FFF", fontSize: 16, marginBottom: 6 }}>{item.text}</Text>
          {page?.extract && (
            <Text style={{ color: "#CCC", fontSize: 14, lineHeight: 20 }}>
              {page.extract}
            </Text>
          )}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
            <Clock width={16} height={16} color="#888" />
            <Text style={{ color: "#888", marginLeft: 6 }}>{item.year}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <ScreenWrapper logoSource={require("../../assets/images/icon.png")} loading={true}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#d2884a" />
          <Text style={{ color: "#AAA", marginTop: 12 }}>Loading historical events...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error || !data) {
    return (
      <ScreenWrapper logoSource={require("../../assets/images/icon.png")}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Calendar width={64} height={64} color="#888" />
          <Text style={{ color: "#FFF", fontSize: 18, marginVertical: 8 }}>Unable to load history</Text>
          <Text style={{ color: "#AAA", textAlign: "center" }}>{error || "Please try again later"}</Text>
          <TouchableOpacity
            onPress={() => setSelectedDate(new Date())}
            style={{ marginTop: 16, padding: 12, backgroundColor: "#d2884a", borderRadius: 8 }}
          >
            <Text style={{ color: "#000", fontWeight: "bold" }}>Reload</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  const { selected:  events = [], births = [], deaths = [] } = data;
  const formattedDate = selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  const renderScene = SceneMap({
    events: () => (
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item, idx) => idx.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
        initialNumToRender={4}
      />
    ),
    births: () => (
      <FlatList
        data={births}
        renderItem={renderEvent}
        keyExtractor={(item, idx) => idx.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
        initialNumToRender={4}
      />
    ),
    deaths: () => (
      <FlatList
        data={deaths}
        renderItem={renderEvent}
        keyExtractor={(item, idx) => idx.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
        initialNumToRender={4}
      />
    ),
  });

  return (
    <ScreenWrapper
      logoSource={require("../../assets/images/icon.png")}
      onProfilePress={() => console.log("Profile tapped")}
      onNotificationPress={() => console.log("Notification tapped")}
      loading={false}
      scrollable={false}
    >
      {/* Date Picker */}

      <View
  style={{
    borderBottomWidth: 1,
    borderBottomColor: "#3a2e28",
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: "#2b211c",
  }}
>
  {/* Header Row */}
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: 16,
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Calendar width={22} height={22} color="#fff" />
      <Text
        style={{
          color: "#fff",
          fontWeight: "700",
          fontSize: 16,
          marginLeft: 8,
        }}
      >
        This Day in History
      </Text>
    </View>

    <TouchableOpacity
      onPress={() => setShowDatePicker(true)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#3a2e28",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
      }}
    >
      <Calendar width={18} height={18} color="#fff" />
      <Text
        style={{
          color: "#fff",
          fontWeight: "600",
          fontSize: 12,
          marginLeft: 6,
        }}
      >
        {formattedDate}
      </Text>
    </TouchableOpacity>
  </View>

  {/* Subtitle */}
  <Text
    style={{
      color: "#ccc",
      fontSize: 14,
      marginTop: 8,
      marginHorizontal: 16,
      lineHeight: 20,
    }}
  >
    Discover what happened on{" "}
    <Text style={{ color: "#f5b041", fontWeight: "600" }}>
      {formattedDate}
    </Text>{" "}
    throughout history.
  </Text>

  {showDatePicker && (
    <DateTimePicker
      value={selectedDate}
      mode="date"
      display="spinner"
      accentColor="#f5b041"
      onChange={(event, date) => {
        setShowDatePicker(false);
        if (date) setSelectedDate(date);
      }}
    />
  )}
</View>




{/* TabView */}
<TabView
  navigationState={{ index, routes }}
  renderScene={renderScene}
  onIndexChange={setIndex}
  lazy
  initialLayout={{ width: Dimensions.get("window").width }}
  renderTabBar={(props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#f5b041", height: 3 }}
      style={{ backgroundColor: "#3a2e28" }}

      activeColor="#f5b041"
      inactiveColor="#ccc"
      pressOpacity={0.7}
    />
  )}
/>

    </ScreenWrapper>
  );
}
