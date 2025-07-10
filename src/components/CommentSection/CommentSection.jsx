import React, { useEffect, useRef, useState } from "react";
import axios from "../../axiosInstance";
import { FaRegComment } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import "./style.css";

export default function CommentSection({
  videoId,
  message,
  setMessage,
  isSuccess,
  setIsSuccess,
}) {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [postComment, setPostComment] = useState("");
  const [loading, setLoading] = useState({ post: false, delete: false });
  const [deleteId, setDeleteId] = useState(null);
  const [openDeleteOption, setOpenDeleteOption] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [fetchingComments, setFetchingComments] = useState(null);

  const commentBoxRef = useRef(null);
  const commentRefs = useRef([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/videos/${videoId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data.data);
      setFetchingComments(false);
      setShowComments(true);
      commentRefs.current = res.data.data.map(() => React.createRef());
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  const handleCommentToggle = async () => {
    if (!userId) {
      setMessage("Please login to access the comments");
      return;
    }
    if (showComments) {
      setShowComments(false);
    } else {
      setFetchingComments(true);
      await fetchComments();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = postComment.trim();
    if (!trimmed) {
      setMessage("Comment cannot be empty.");
      return;
    }
    setLoading((p) => ({ ...p, post: true }));
    try {
      const formData = { user: userId, video: videoId, text: trimmed };
      const res = await axios.post(`/api/videos/${videoId}/comment`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status === "success") {
        setIsSuccess(true);
        setMessage("Comment posted successfully");
        setPostComment("");
        await fetchComments();
      } else {
        setIsSuccess(false);
        setMessage("Something went wrong. Try again.");
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.response?.data?.message || err.message);
    } finally {
      setLoading((p) => ({ ...p, post: false }));
    }
  };

  const handleDeleteComment = async (commentId) => {
    setLoading((p) => ({ ...p, delete: true }));
    try {
      const res = await axios.delete(`/api/user/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsSuccess(true);
      setMessage(res.data.message || "Comment deleted successfully");
      await fetchComments();
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.response?.data?.message || err.message);
    } finally {
      setDeleteConfirmId(null);
      setLoading((p) => ({ ...p, delete: false }));
    }
  };

  return (
    <div className="comment-wrapper">
      <div className="view-all-comments-btn" onClick={handleCommentToggle}>
        <FaRegComment size={20} />
        <span className="vac-text">View All Comments</span>
      </div>

      {fetchingComments && !showComments && (
        <div className="comment-loading">Loading...</div>
      )}

      {showComments && (
        <div className="comment-box" ref={commentBoxRef}>
          {comments.length > 0 ? (
            comments.map((c, index) => (
              <div
                className="comment-item"
                key={c._id}
                ref={(el) => (commentRefs.current[index] = el)}
              >
                <div className="comment-header">
                  <div className="comment-owner">{c.user?.name || "Anonymous"}</div>
                  {userId === c.user._id && (
                    <button
                      className="three-dots-btn"
                      onClick={() => {
                        setOpenDeleteOption((p) => !p);
                        setDeleteId(c._id);
                        setDeleteConfirmId(null);
                      }}
                    >
                      <BsThreeDotsVertical />
                    </button>
                  )}
                </div>
                <div className="comment-text">{c.text}</div>

                {openDeleteOption && deleteId === c._id && (
                  <button
                    className="comment-delete-btn"
                    onClick={() => {
                      setDeleteConfirmId(c._id);
                      if (
                        commentRefs.current[index] &&
                        commentBoxRef.current
                      ) {
                        const elTop = commentRefs.current[index].offsetTop;
                        commentBoxRef.current.scrollTo({
                          top: elTop,
                          behavior: "smooth",
                        });
                      }
                    }}
                    disabled={loading.delete}
                  >
                    {loading.delete ? "Deleting..." : "Delete Comment"}
                  </button>
                )}

                {deleteConfirmId === c._id && (
                  <div className="delete-confirm-box">
                    <p style={{ marginTop: "10px" }}>
                      Are you sure you want to delete this comment?
                    </p>
                    <div className="btn-set">
                      <button onClick={() => handleDeleteComment(c._id)}>
                        Yes
                      </button>
                      <button
                        onClick={() => {
                          setDeleteConfirmId(null);
                          setOpenDeleteOption(false);
                        }}
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="nocomment-text">No comments posted</p>
          )}
        </div>
      )}

      <div className="comment-post-box">
        <form onSubmit={handleSubmit} className="comment-form">
          <input
            type="text"
            placeholder="Felt something? Say it here..."
            value={postComment}
            onChange={(e) => setPostComment(e.target.value)}
            disabled={loading.post}
          />
          <button
            type="submit"
            className="post-btn"
            disabled={loading.post || postComment.trim().length === 0}
          >
            {loading.post ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
