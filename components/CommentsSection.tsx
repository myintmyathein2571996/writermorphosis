import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_BASE = "https://writermorphosis.com/wp-json/wp/v2";

const colors = {
  text: "#f8f8f6",
  background: "#1a1a1a",
  card: "#2a2a2a",
  tint: "#f4d6c1",
  icon: "#c2c2c2",
  border: "#333",
};

interface Comment {
  id: number;
  parent: number;
  date: string;
  author_name?: string;
  author_avatar_urls?: Record<string, string>;
  content?: { rendered: string };
  children?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  depth?: number;
  onReplyPress: (id: number) => void;
}

function buildThreadTree(flatComments: Comment[]): Comment[] {
  const map: Record<number, Comment & { children: Comment[] }> = {};
  const roots: Comment[] = [];

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

  const sortRecursively = (nodes: Comment[]) => {
    nodes.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    nodes.forEach((n) => sortRecursively(n.children || []));
  };
  sortRecursively(roots);

  return roots;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, depth = 0, onReplyPress }) => {
  const stripHtml = (html?: string) => (html ? html.replace(/<\/?[^>]+(>|$)/g, "").trim() : "");
  const avatar = comment.author_avatar_urls?.["48"] || comment.author_avatar_urls?.[48] || null;

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
              backgroundColor: colors.border,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
            }}
          >
            <Text style={{ fontWeight: "700", color: colors.text }}>
              {comment.author_name ? comment.author_name[0]?.toUpperCase() : "U"}
            </Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "700", fontSize: 14, color: colors.text }}>
            {comment.author_name || "Guest"}
          </Text>
          <Text style={{ color: colors.icon, fontSize: 12 }}>
            {new Date(comment.date).toLocaleString()}
          </Text>
          <Text style={{ color: colors.text, marginVertical: 4 }}>
            {stripHtml(comment.content?.rendered)}
          </Text>
          <TouchableOpacity onPress={() => onReplyPress(comment.id)}>
            <Text style={{ color: colors.tint, fontWeight: "600" }}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>

      {comment.children?.map((child) => (
        <CommentItem
          key={child.id}
          comment={child}
          depth={depth + 1}
          onReplyPress={onReplyPress}
        />
      ))}
    </View>
  );
};

interface CommentsSectionProps {
  postId: number;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const [commentsFlat, setCommentsFlat] = useState<Comment[]>([]);
  const [tree, setTree] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user, token } = useAuth();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [parentForReply, setParentForReply] = useState(0);
  const [replyingToName, setReplyingToName] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/comments?post=${postId}&per_page=100`);
      if (!res.ok) throw new Error(`Failed to load comments: ${res.status}`);
      const data: Comment[] = await res.json();
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

  const handleReplyPress = (commentId: number) => {
    setParentForReply(commentId);
    const target = commentsFlat.find((c) => c.id === commentId);
    setReplyingToName(target?.author_name || null);
    setShowModal(true);
  };

  const resetForm = () => {
    setParentForReply(0);
    setReplyingToName(null);
    setMessage("");
    setError(null);
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    setSending(true);
    setError(null);

    const payload = {
      post: postId,
      author_name: user?.name,
      author_email: user?.email,
      content: { raw: message.trim() },
      parent: parentForReply || 0,
    };

    try {
      const res = await fetch(`${API_BASE}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to post comment. May need moderation.");
      await fetchComments();
      resetForm();
    } catch (err: any) {
      console.warn(err);
      setError(err.message || "Failed to post comment.");
    } finally {
      setSending(false);
    }
  };

  const previewComments = tree.slice(0, 2);

  return (
    <View style={{ marginTop: 12 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          marginBottom: 8,
          color: colors.text,
          paddingVertical: 20,
        }}
      >
        Comments
      </Text>

      {previewComments.map((c) => (
        <CommentItem key={c.id} comment={c} onReplyPress={handleReplyPress} />
      ))}

      {tree.length > 2 && (
        <TouchableOpacity onPress={() => setShowModal(true)} style={{ marginTop: 12 }}>
          <Text style={{ color: colors.tint, fontWeight: "600" }}>
            View all {tree.length} comments
          </Text>
        </TouchableOpacity>
      )}

      {/* Modal */}
      <Modal visible={showModal} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 12,
                borderBottomWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>
                Comments ({commentsFlat.length})
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={{ color: colors.tint, fontWeight: "600" }}>Close</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator color={colors.tint} />
              </View>
            ) : error ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#DC2626" }}>{error}</Text>
              </View>
            ) : (
              <FlatList
                data={tree}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <CommentItem comment={item} onReplyPress={handleReplyPress} />}
                contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
              />
            )}

            {/* Sticky form */}
            <View
              style={{
                padding: 12,
                borderTopWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.card,
              }}
            >
              {user ? (
                <>
                  {parentForReply !== 0 && (
                    <View style={{ flexDirection: "row", marginBottom: 8 }}>
                      <Text style={{ color: colors.text }}>
                        Replying to {replyingToName || "comment"}
                      </Text>
                      <TouchableOpacity onPress={resetForm} style={{ marginLeft: 10 }}>
                        <Text style={{ color: "#EF4444", fontWeight: "600" }}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  <TextInput
                    placeholder="Write your comment..."
                    placeholderTextColor={colors.icon}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={4}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.border,
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderRadius: 6,
                      minHeight: 80,
                      textAlignVertical: "top",
                      marginBottom: 8,
                      color: colors.text,
                    }}
                  />
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={sending}
                    style={{
                      backgroundColor: colors.tint,
                      paddingVertical: 12,
                      borderRadius: 8,
                      alignItems: "center",
                    }}
                  >
                    {sending ? (
                      <ActivityIndicator color={colors.background} />
                    ) : (
                      <Text style={{ color: colors.background, fontWeight: "700" }}>
                        Post Comment
                      </Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <View style={{ alignItems: "center", padding: 20 }}>
                  <Text style={{ color: colors.text, marginBottom: 12 }}>
                    Please login to comment.
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/login")}
                    style={{
                      backgroundColor: colors.tint,
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: colors.background, fontWeight: "700" }}>Login</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default CommentsSection;
