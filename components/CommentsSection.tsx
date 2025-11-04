// import { useTheme } from "@/context/ThemeContext";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_BASE = "https://writermorphosis.com/wp-json/wp/v2";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildThreadTree(flatComments = []) {
  const map = {};
  const roots = [];

  flatComments.forEach((c) => {
    map[c.id] = { ...c, children: [] };
  });

  flatComments.forEach((c) => {
    if (c.parent && c.parent !== 0 && map[c.parent]) {
      map[c.parent].children.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });

  const sortRecursively = (nodes) => {
    nodes.sort((a, b) => new Date(a.date) - new Date(b.date));
    nodes.forEach((n) => sortRecursively(n.children));
  };
  sortRecursively(roots);

  return roots;
}

function CommentItem({ comment, depth = 0, onReplyPress, themeColors }) {
  const stripHtml = (html) =>
    html ? html.replace(/<\/?[^>]+(>|$)/g, "").trim() : "";

  const avatar =
    comment.author_avatar_urls?.["48"] || comment.author_avatar_urls?.[48] || null;

  return (
    <View style={{ marginBottom: 12, paddingLeft: depth * 12 }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 8 }}
          />
        ) : (
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: themeColors.border,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
            }}
          >
            <Text style={{ fontWeight: "700", color: themeColors.text }}>
              {comment.author_name ? comment.author_name[0]?.toUpperCase() : "U"}
            </Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "700", fontSize: 14, color: themeColors.text }}>
            {comment.author_name || "Guest"}
          </Text>
          <Text style={{ color: themeColors.icon, fontSize: 12 }}>
            {new Date(comment.date).toLocaleString()}
          </Text>
          <Text style={{ color: themeColors.text, marginVertical: 4 }}>
            {stripHtml(comment.content?.rendered)}
          </Text>
          <TouchableOpacity onPress={() => onReplyPress(comment.id)}>
            <Text style={{ color: themeColors.tint, fontWeight: "600" }}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>

      {comment.children?.map((child) => (
        <CommentItem
          key={child.id}
          comment={child}
          depth={depth + 1}
          onReplyPress={onReplyPress}
          themeColors={themeColors}
        />
      ))}
    </View>
  );
}

export default function CommentsSection({ postId }) {
  const colorScheme = useColorScheme();
//   const {theme} = useTheme();

  const [commentsFlat, setCommentsFlat] = useState([]);
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [parentForReply, setParentForReply] = useState(0);
  const [replyingToName, setReplyingToName] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/comments?post=${postId}&per_page=100`);
      if (!res.ok) throw new Error(`Failed to load comments: ${res.status}`);
      const data = await res.json();
      setCommentsFlat(data || []);
      setTree(buildThreadTree(data || []));
    } catch (err) {
      console.warn(err);
      setError("Unable to load comments.");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleReplyPress = (commentId) => {
    setParentForReply(commentId);
    const target = commentsFlat.find((c) => c.id === commentId);
    setReplyingToName(target?.author_name || null);
    setShowModal(true); // open modal on reply
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setMessage("");
    setParentForReply(0);
    setReplyingToName(null);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !EMAIL_RE.test(email) || !message.trim()) {
      setError("Please fill all fields correctly.");
      return;
    }

    setSending(true);
    setError(null);

    const payload = {
  post: postId,
  author_name: name.trim(),
  author_email: email.trim(),
  content: { raw: message.trim() }, 
  parent: parentForReply || 0,
};
    try {
      const res = await fetch(`${API_BASE}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to post comment. May need moderation.");
      await fetchComments();
      resetForm();
    } catch (err) {
      console.warn("post comment error", err);
      setError(err.message || "Failed to post comment.");
    } finally {
      setSending(false);
    }
  };

  const previewComments = tree.slice(0, 2);

  return (
    <View style={{ marginTop: 12 }}>
      {/* Title */}
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8, color: theme.text , paddingVertical : 20}}>
        Comments
      </Text>

      {/* Inline preview */}
      {previewComments.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          depth={0}
          onReplyPress={handleReplyPress}
          themeColors={theme}
        />
      ))}

       {/* View all comments button */}
      {tree.length > 2 && (
        <TouchableOpacity onPress={() => setShowModal(true)} style={{ marginTop: 12 }}>
          <Text style={{ color: theme.tint, fontWeight: "600" }}>
            View all {tree.length} comments
          </Text>
        </TouchableOpacity>
      )}

      {/* Comment form inline */}
      <View style={{ marginTop: 12, borderTopWidth: 1, borderColor: theme.border, paddingTop: 12 }}>
        <TextInput
          placeholder="Your name"
          placeholderTextColor={theme.icon}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          style={{
            borderWidth: 1,
            borderColor: theme.border,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderRadius: 6,
            marginBottom: 8,
            color: theme.text,
          }}
          editable={!sending}
        />
        <TextInput
          placeholder="Your email"
          placeholderTextColor={theme.icon}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: theme.border,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderRadius: 6,
            marginBottom: 8,
            color: theme.text,
          }}
          editable={!sending}
        />
        <TextInput
          placeholder="Write your comment..."
          placeholderTextColor={theme.icon}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          style={{
            borderWidth: 1,
            borderColor: theme.border,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderRadius: 6,
            minHeight: 80,
            textAlignVertical: "top",
            marginBottom: 8,
            color: theme.text,
          }}
          editable={!sending}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={sending}
          style={{
            backgroundColor: theme.tint,
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          {sending ? (
            <ActivityIndicator color={theme.background} />
          ) : (
            <Text style={{ color: theme.background, fontWeight: "700" }}>
              Post Comment
            </Text>
          )}
        </TouchableOpacity>
      </View>

     

      {/* Full-screen modal */}
      <Modal visible={showModal} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 12,
                borderBottomWidth: 1,
                borderColor: theme.border,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "700", color: theme.text }}>
                Comments ({commentsFlat.length})
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={{ color: theme.tint, fontWeight: "600" }}>Close</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator color={theme.tint} />
              </View>
            ) : error ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#DC2626" }}>{error}</Text>
              </View>
            ) : (
              <FlatList
                data={tree}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <CommentItem
                    comment={item}
                    depth={0}
                    onReplyPress={handleReplyPress}
                    themeColors={theme}
                  />
                )}
                contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
              />
            )}

            {/* Sticky comment form in modal */}
           <View
  style={{
    padding: 12,
    borderTopWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
  }}
>
  {parentForReply !== 0 && (
    <View style={{ flexDirection: "row", marginBottom: 8 }}>
      <Text style={{ color: theme.text }}>
        Replying to {replyingToName || "comment"}
      </Text>
      <TouchableOpacity
        onPress={resetForm}
        style={{ marginLeft: 10 }}
      >
        <Text style={{ color: "#EF4444", fontWeight: "600" }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  )}

  <TextInput
    placeholder="Your name"
    placeholderTextColor={theme.icon}
    value={name}
    onChangeText={setName}
    autoCapitalize="words"
    style={{
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 6,
      marginBottom: 8,
      color: theme.text,
    }}
  />

  <TextInput
    placeholder="Your email"
    placeholderTextColor={theme.icon}
    value={email}
    onChangeText={setEmail}
    keyboardType="email-address"
    autoCapitalize="none"
    style={{
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 6,
      marginBottom: 8,
      color: theme.text,
    }}
  />

  <TextInput
    placeholder="Write your comment..."
    placeholderTextColor={theme.icon}
    value={message}
    onChangeText={setMessage}
    multiline
    numberOfLines={4}
    style={{
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 6,
      minHeight: 80,
      textAlignVertical: "top",
      marginBottom: 8,
      color: theme.text,
    }}
  />

  <TouchableOpacity
    onPress={handleSubmit}
    disabled={sending}
    style={{
      backgroundColor: theme.tint,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    }}
  >
    {sending ? (
      <ActivityIndicator color={theme.background} />
    ) : (
      <Text style={{ color: theme.background, fontWeight: "700" }}>
        Post Comment
      </Text>
    )}
  </TouchableOpacity>
</View>

          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
