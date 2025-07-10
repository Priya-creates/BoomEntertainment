import React from "react";
import "./style.css";
import Background from "../../components/Background/Background";

const Home = () => {
  return (
    <div className="home-wrapper">
      <Background />

      <div className="intro-content">
        <h1>Explore & Enjoy Videos Like Never Before</h1>
        <p>
          Welcome to <strong>Boom Entertainment</strong> – upload your own
          shorts or YouTube videos, discover others’ creations, and support
          creators by unlocking premium content.
        </p>
        <div className="intro-buttons">
          <a href="/feed" className="intro-btn">
            ✨ Start Exploring
          </a>
          <a href="/login" className="intro-btn">
            🔓 Unlock Access
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
