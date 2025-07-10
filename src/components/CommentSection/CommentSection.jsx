import React from "react";
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
  const [comments, setComments] = React.useState([]);
  const [showComments, setShowComments] = React.useState(false);
  const [postComment, setPostComment] = React.useState("");
  const [loading, setLoading] = React.useState({ post: false, delete: false });
  const [deleteId, setDeleteId] = React.useState(null);
  const [openDeleteOption, setOpenDeleteOption] = React.useState(false);
  const [fetchingComments, setFetchingComments] = React.useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  async function fetchComments() {
    try {
      const res = await axios.get(
        `/api/videos/${videoId}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data.data);
      setFetchingComments(false);
      setShowComments(true);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  }

  async function handleCommentToggle() {
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
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = postComment.trim();
    if (!trimmed) {
      setMessage("Comment cannot be empty.");
      return;
    }
    setLoading((p) => ({ ...p, post: true }));
    try {
      const formData = { user: userId, video: videoId, text: trimmed };
      const res = await axios.post(
        `/api/videos/${videoId}/comment`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
  }

  async function handleDeleteComment(commentId) {
    setLoading((p) => ({ ...p, delete: true }));
    try {
      const res = await axios.delete(
        `/api/user/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
  }

  return (
    <div className="comment-wrapper">
      <div className="view-all-comments-btn" onClick={handleCommentToggle}>
        <FaRegComment size={20} />
        <span className="vac-text">View all comments</span>
      </div>

      {fetchingComments && !showComments && (
        <div className="comment-loading">Loading...</div>
      )}

      {showComments && (
        <div className="comment-box">
          {comments.length > 0 ? (
            comments.map((c) => (
              <div className="comment-item" key={c._id}>
                <div className="comment-header">
                  <div className="comment-owner">
                    {c.user?.name || "Anonymous"}
                  </div>
                  {userId === c.user._id && (
                    <button
                      className="three-dots-btn"
                      onClick={() => {
                        setOpenDeleteOption((p) => !p);
                        setDeleteId(c._id);
                        deleteConfirmId && setDeleteConfirmId(null);
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
                    onClick={() => setDeleteConfirmId(c._id)}
                    disabled={loading.delete}
                  >
                    {loading.delete ? "Deleting..." : "Delete Comment"}
                  </button>
                )}

                {deleteConfirmId === c._id && (
                  <div className="delete-confirm-box">
                    <p>Are you sure you want to delete this comment?</p>
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
            disabled={loading.post || postComment.trim().length === 0}
          >
            {loading.post ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
