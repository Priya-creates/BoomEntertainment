import React from "react";
import "./style.css";

const Background = () => {
  return (
    <div className="background-container">
      <div className="crescent-moon"></div>

      <div className="shooting-wrapper">
        <div className="shooting-star"></div>
      </div>
      <div className="shooting-wrapper-two">
        <div className="shooting-star-two"></div>
      </div>

      <div className="stars-layer">
        {Array.from({ length: 240 }).map((_, i) => {
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const size = Math.random() * 2 + 1.5;
          const delay = Math.random() * 5;

          return (
            <div
              className="star"
              key={i}
              style={{
                top: `${top}vh`,
                left: `${left}vw`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${delay}s`,
                boxShadow: `0 0 ${size * 2}px white`,
              }}
            ></div>
          );
        })}
      </div>

      <div className="arc-back" />
    </div>
  );
};

export default Background;
