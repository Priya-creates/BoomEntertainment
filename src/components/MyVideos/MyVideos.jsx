import React from "react";
import axios from "../../axiosInstance";
import EditVideo from "../EditVideo/EditVideo";
import DeleteVideo from "../DeleteVideo/DeleteVideo";
import "./style.css";
import { useUser } from "../../context/UserContext";

const MyVideos = () => {
  const [videos, setVideos] = React.useState([]);
  const [activeVideoId, setActiveVideoId] = React.useState(null);
  const [showEdit, setShowEdit] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);
  const [deleteInProgress, setDeleteInProgress] = React.useState(false);
  const [editDisable, setEditDisable] = React.useState(false);
  const { userChanged, setUserChanged } = useUser();

  const fetchMyVideos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/user/my-videos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos(res.data.data);
    } catch (err) {
      console.error(err.response?.data?.message || "Error fetching videos");
    }
  };

  React.useEffect(() => {
    fetchMyVideos();
    if (userChanged) {
      setUserChanged(false);
    }
  }, [userChanged]);

  const convertToEmbedUrl = (url) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname;
      if (host === "youtu.be")
        return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
      if (host.includes("youtube.com") && parsed.searchParams.get("v"))
        return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
      return url;
    } catch {
      return url;
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const handleEdit = (id) => {
    setShowDelete(false);
    setActiveVideoId(id);
    setShowEdit(true);
    setDeleteId(null);
  };

  const handleDelete = (id) => {
    setShowDelete(true);
    setActiveVideoId(id);
    setDeleteId(id);
    setShowEdit(false);
  };

  const removeVideoFromList = (id) => {
    setVideos((prev) => prev.filter((v) => v._id !== id));
  };

  function handleEditDisable(videoId) {
    if (activeVideoId === videoId) {
      return showDelete || editDisable;
    }
    return false;
  }

  function handleDeleteDisable(videoId) {
    if (activeVideoId === videoId) {
      return showEdit || deleteInProgress || editDisable;
    }
    return false;
  }

  return (
    <div className="myvideos-wrapper">
      {videos.length === 0 && <p className="error-box">
        <div className="error-msg">No videos have been uploaded</div>
        </p>}

      {videos.map((video) => (
        <React.Fragment key={video._id}>
          <div className="video-card">
            <div className="video-container">
              <h3 className="heading">{video.title}</h3>
              {video.type === "short" ? (
                <video controls>
                  <source
                    src={`${video.filePath}`}
                    type="video/mp4"
                  />
                </video>
              ) : (
                <iframe
                  src={convertToEmbedUrl(video.url)}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              )}
            </div>

            <div className="details-box">
              <p className="small-heading">Video Details</p>
              <div className="details">
                <div className="prop">
                  <div className="prop-key">Title</div>
                  <div className="prop-value">{video.title}</div>
                </div>
                <div className="prop">
                  <div className="prop-key">Type</div>
                  <div className="prop-value">{video.type}</div>
                </div>
                <div className="prop">
                  <div className="prop-key">Creator</div>
                  <div className="prop-value">{video.creator.name}</div>
                </div>
                <div className="prop">
                  <div className="prop-key">Description</div>
                  <div className="prop-value">
                    {video.description ? video.description : "-"}
                  </div>
                </div>
                <div className="prop">
                  <div className="prop-key">Price</div>
                  <div className="prop-value">₹{video.price}</div>
                </div>
                <div className="prop">
                  <div className="prop-key">Created At</div>
                  <div className="prop-value">
                    {formatDate(video.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            <div className="edit-delete-buttonset">
              <button
                onClick={() => handleEdit(video._id)}
                disabled={handleEditDisable(video._id)}
                className="edit-btn"
              >
                Edit Video
              </button>
              <button
                onClick={() => handleDelete(video._id)}
                disabled={handleDeleteDisable(video._id)}
                className="delete-btn"
              >
                Delete Video
              </button>
            </div>
          </div>

          {showEdit && activeVideoId === video._id && (
            <EditVideo
              videoId={video._id}
              setShowEdit={setShowEdit}
              onSuccess={fetchMyVideos}
              disable={editDisable}
              setDisable={setEditDisable}
            />
          )}

          {deleteId === video._id && showDelete && (
            <DeleteVideo
              videoId={video._id}
              setShowDelete={setShowDelete}
              setDeleteId={setDeleteId}
              onSuccess={() => {
                removeVideoFromList(video._id);
              }}
              setDeleteInProgress={setDeleteInProgress}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MyVideos;
