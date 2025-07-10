import React, { useEffect, useState } from "react";
import axios from "../../axiosInstance";
import { useLocation } from "react-router-dom";
import "./style.css";

const AboutVideo = ({ videoId }) => {
  const [videoDetails, setVideoDetails] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    async function fetchVideoDetails() {
      try {
        const res = await axios.get(
          `/api/videos/public/${videoId}`
        );
        const obj = res.data.data;

        if (obj.createdAt) {
          const date = new Date(obj.createdAt);
          obj.createdAt = date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        }

        setVideoDetails(obj);
      } catch (err) {
        setErrorMsg(err.response?.data?.message || err.message);
      }
    }

    fetchVideoDetails();
  }, [videoId]);

  return (
    <div className="aboutvideo-wrapper">
      <p className="heading">About the video</p>
      {errorMsg && <div className="formError-box">{errorMsg}</div>}

      <div className="outer-container">
        {Object.entries(videoDetails).map(([key, value], index) => (
          <div className="prop" key={index}>
            <div className="prop-key">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </div>
            <div className="prop-value">
              {key === "price"
                ? `₹${value}`
                : key === "type"
                ? `${value.charAt(0).toUpperCase() + value.slice(1)} video`
                : value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutVideo;
