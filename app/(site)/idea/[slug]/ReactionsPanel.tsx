"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Comment = {
  id: string;
  author_name: string;
  comment_text: string;
  created_at: string;
  user_id: string;
};

function displayName(user: any): string {
  return user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "ഇപ്പോൾ";
  if (mins < 60) return `${mins} മിനിറ്റ് മുൻപ്`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} മണിക്കൂർ മുൻപ്`;
  const days = Math.floor(hours / 24);
  return `${days} ദിവസം മുൻപ്`;
}

export default function ReactionsPanel({ ideaSlug }: { ideaSlug: string }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [myReaction, setMyReaction] = useState<"like" | "dislike" | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {

    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user ?? null);
      setUserId(userData.user?.id ?? null);

      const { data: reactions } = await supabase
        .from("idea_reactions")
        .select("reaction, user_id")
        .eq("idea_slug", ideaSlug);

      const likes = (reactions ?? []).filter((r) => r.reaction === "like");
      const dislikes = (reactions ?? []).filter((r) => r.reaction === "dislike");
      setLikeCount(likes.length);
      setDislikeCount(dislikes.length);
      if (userData.user) {
        const mine = (reactions ?? []).find((r) => r.user_id === userData.user!.id);
        setMyReaction((mine?.reaction as "like" | "dislike") ?? null);
      }

      const { data: commentRows } = await supabase
        .from("idea_comments")
        .select("*")
        .eq("idea_slug", ideaSlug)
        .order("created_at", { ascending: false });
      setComments((commentRows as Comment[]) ?? []);

      setLoading(false);
    }
    load();
  }, [ideaSlug]);

  async function handleReact(type: "like" | "dislike") {
    if (!userId) {
      setNotice("Like/Dislike ചെയ്യാൻ ലോഗിൻ ചെയ്യൂ");
      return;
    }
    setBusy(true);
    setNotice("");

    if (myReaction === type) {
      // tapping the same button again removes the reaction
      await supabase.from("idea_reactions").delete().eq("idea_slug", ideaSlug).eq("user_id", userId);
      setMyReaction(null);
      if (type === "like") setLikeCount((c) => c - 1);
      else setDislikeCount((c) => c - 1);
    } else {
      await supabase
        .from("idea_reactions")
        .upsert({ idea_slug: ideaSlug, user_id: userId, reaction: type }, { onConflict: "idea_slug,user_id" });

      if (myReaction === "like") setLikeCount((c) => c - 1);
      if (myReaction === "dislike") setDislikeCount((c) => c - 1);
      if (type === "like") setLikeCount((c) => c + 1);
      else setDislikeCount((c) => c + 1);
      setMyReaction(type);
    }
    setBusy(false);
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) {
      setNotice("Comment ചെയ്യാൻ ലോഗിൻ ചെയ്യൂ");
      return;
    }
    const text = commentText.trim();
    if (!text) return;

    setBusy(true);
    setNotice("");
    const { data, error } = await supabase
      .from("idea_comments")
      .insert({ idea_slug: ideaSlug, user_id: userId, author_name: displayName(user), comment_text: text })
      .select()
      .single();
    setBusy(false);

    if (error) {
      setNotice(error.message);
      return;
    }
    setComments((c) => [data as Comment, ...c]);
    setCommentText("");
  }

  async function handleDeleteComment(id: string) {
    await supabase.from("idea_comments").delete().eq("id", id);
    setComments((c) => c.filter((cm) => cm.id !== id));
  }

  if (loading) return null;

  return (
    <div className="reactions-panel">
      <div className="reactions-buttons">
        <button
          type="button"
          className={`reaction-btn ${myReaction === "like" ? "active-like" : ""}`}
          onClick={() => handleReact("like")}
          disabled={busy}
        >
          👍 <span>{likeCount}</span>
        </button>
        <button
          type="button"
          className={`reaction-btn ${myReaction === "dislike" ? "active-dislike" : ""}`}
          onClick={() => handleReact("dislike")}
          disabled={busy}
        >
          👎 <span>{dislikeCount}</span>
        </button>
      </div>
      {notice && (
        <p className="reactions-notice">
          {notice} — <a href="/profile">ലോഗിൻ ചെയ്യാൻ ഇവിടെ ക്ലിക്ക് ചെയ്യൂ</a>
        </p>
      )}

      <h3 className="reactions-comments-title">അഭിപ്രായങ്ങൾ ({comments.length})</h3>

      <form onSubmit={handleCommentSubmit} className="reactions-comment-form">
        <textarea
          placeholder={userId ? "നിങ്ങളുടെ അഭിപ്രായം എഴുതുക..." : "Comment ചെയ്യാൻ ലോഗിൻ ചെയ്യൂ"}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={2}
          disabled={!userId || busy}
        />
        <button type="submit" className="reactions-post-btn" disabled={!userId || busy || !commentText.trim()}>
          Post
        </button>
      </form>

      <div className="reactions-comment-list">
        {comments.length === 0 ? (
          <p className="reactions-empty">ആദ്യത്തെ അഭിപ്രായം എഴുതൂ!</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="reactions-comment">
              <div className="reactions-comment-head">
                <span className="reactions-comment-author">{c.author_name}</span>
                <span className="reactions-comment-time">{timeAgo(c.created_at)}</span>
              </div>
              <p className="reactions-comment-text">{c.comment_text}</p>
              {userId === c.user_id && (
                <button type="button" className="reactions-comment-delete" onClick={() => handleDeleteComment(c.id)}>
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
