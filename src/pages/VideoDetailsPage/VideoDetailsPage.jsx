import React from "react";
import { useParams } from "react-router-dom";
import AboutVideo from "../../components/AboutVideo/AboutVideo";

const VideoDetailsPage = () => {
  const { videoId } = useParams();
  return <AboutVideo videoId={videoId} />;
};

export default VideoDetailsPage;
