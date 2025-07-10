import React, { useEffect, useRef, useState } from "react";
import axios from "../../axiosInstance";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CommentSection from "../CommentSection/CommentSection";
import "./style.css";
import { useUser } from "../../context/UserContext";

export default function VideoList() {
  const [videos, setVideos] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [purchasedVideos, setPurchasedVideos] = useState([]);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const navigate = useNavigate();
  const videoRefs = useRef({});
  const { userId } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchVideos() {
      try {
        const res = await axios.get("/api/videos");
        setVideos(res.data.data);
        setErrorMsg("");
      } catch (err) {
        setErrorMsg(err?.response?.data?.message || "Failed to fetch videos.");
      }
    }

    async function fetchPurchases() {
      try {
        const res = await axios.get("/api/user/my-purchases", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const arr = res.data.data.map((ele) => ele.video._id);
        setPurchasedVideos(arr);
      } catch (err) {
        setErrorMsg("Failed to fetch your purchased videos.");
      }
    }

    fetchVideos();
    fetchPurchases();
  }, []);

  function convertToEmbedUrl(url) {
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname;

      if (hostname === "youtu.be") {
        const videoId = parsed.pathname.slice(1);
        return `https://www.youtube.com/embed/${videoId}`;
      }

      if (hostname.includes("youtube.com") && parsed.searchParams.get("v")) {
        const videoId = parsed.searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}`;
      }

      return url;
    } catch {
      return url;
    }
  }

  function handleMessageOk() {
    setIsSuccess(null);
    setMessage("");
  }

  function handleClick(videoId, isUnlocked, isCreatorVideo) {
    if (!(!isUnlocked && !isCreatorVideo)) {
      videoRefs.current[videoId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      const videoEl = videoRefs.current[videoId]?.querySelector("video");
      if (videoEl) videoEl.play();
    } else {
      navigate(`/video/buyandgift/${videoId}`);
      window.scrollTo(0, 0);
    }
  }

  function knowDetails(videoId) {
    navigate(`/video/details/${videoId}`);
    setTimeout(() => window.scrollTo(0, 0), 100); 
    
  }

  return (
    <div className="feed-wrapper">
      <h1 className="feed-heading">Watch & Enjoy</h1>

      {errorMsg && (
        <p className="error-box">
          <div className="error-msg">{errorMsg}</div>
        </p>
      )}
      {videos.length === 0 && !errorMsg && (
        <p className="no-videos">No videos found</p>
      )}

      {videos.map((video) => {
        const isUnlocked =
          video.price === 0 || purchasedVideos.includes(video._id);
        const token = localStorage.getItem("token");
        const isCreatorVideo = token && video.creator.toString() === userId;

        return (
          <div
            className="feed-video-card"
            key={video._id}
            ref={(el) => (videoRefs.current[video._id] = el)}
          >
            <h2 className="video-title">{video.title}</h2>
            {video.type === "short" && console.log(video.filePath)}

            <div className="video-wrapper">
              {video.type === "short" ? (
                <video className="video-element" controls>
                  <source src={`${video.filePath}`} type="video/mp4" />
                </video>
              ) : (
                <iframe
                  className="video-element"
                  src={convertToEmbedUrl(video.url)}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              )}

              {!isUnlocked && !isCreatorVideo && (
                <div className="video-overlay">
                  <p className="locked">
                    <FaLock /> Locked
                  </p>
                </div>
              )}
            </div>

            <div className="below-video">
              <p className="video-type">Type: {video.type}</p>

              <div className="video-action-buttons">
                <button
                  onClick={() =>
                    handleClick(video._id, isUnlocked, isCreatorVideo)
                  }
                >
                  {!isUnlocked && !isCreatorVideo
                    ? "Buy and Watch"
                    : "Watch Now"}
                </button>
                <button onClick={() => knowDetails(video._id)}>Details</button>
              </div>

              <CommentSection
                videoId={video._id}
                message={message}
                setMessage={setMessage}
                isSuccess={isSuccess}
                setIsSuccess={setIsSuccess}
              />
            </div>
          </div>
        );
      })}

      {message && (
        <div className="message-overlay">
          <div className="message-box">
            <div className={`alert ${isSuccess ? "success" : "error"}`}>
              <p>{message}</p>
            </div>
            <button className="alert-ok-btn" onClick={handleMessageOk}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
