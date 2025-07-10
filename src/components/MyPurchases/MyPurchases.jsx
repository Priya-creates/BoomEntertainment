import React from "react";
import axios from "../../axiosInstance";
import "./style.css";
import { useUser } from "../../context/UserContext";

const MyPurchases = () => {
  const [purchases, setPurchases] = React.useState([]);
  const { userChanged, setUserChanged } = useUser();
  const [errorMsg, setErrorMsg] = React.useState("");

  React.useEffect(() => {
    async function fetchMyPurchases() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/user/my-purchases`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPurchases(res.data.data);
      } catch (err) {
        setErrorMsg("No purchases have been made by you");
      }
    }
    fetchMyPurchases();
    if (userChanged) {
      setUserChanged(false);
    }
  }, [userChanged]);

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

  function formatDate(old) {
    const date = new Date(old);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  }

  return (
    <div className="mypurchases-wrapper">
      {purchases.length === 0 && (
        <p className="error-box">
          <div className="error-msg">{errorMsg}</div>
        </p>
      )}

      {purchases.map((purchase) => (
        <div className="video-card" key={purchase._id}>
          <div className="video-container">
            <h3 className="heading">{purchase.video.title}</h3>
            {purchase.video.type === "short" ? (
              <video controls>
                <source src={`${purchase.video.filePath}`} type="video/mp4" />
              </video>
            ) : (
              <iframe
                src={convertToEmbedUrl(purchase.video.url)}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            )}
          </div>

          <div className="details-box">
            <p className="small-heading">Video Details</p>
            <div className="details">
              <div className="prop">
                <div className="prop-key">Title</div>
                <div className="prop-value">{purchase.video.title}</div>
              </div>
              {purchase.video.description && (
                <div className="prop">
                  <div className="prop-key">Description</div>
                  <div className="prop-value">{purchase.video.description}</div>
                </div>
              )}
              <div className="prop">
                <div className="prop-key">Type</div>
                <div className="prop-value">
                  {purchase.video.type === "long"
                    ? "Long Video"
                    : "Short Video"}
                </div>
              </div>
              {purchase.video.price > 0 && (
                <div className="prop">
                  <div className="prop-key">Price</div>
                  <div className="prop-value">₹{purchase.video.price}</div>
                </div>
              )}
              <div className="prop">
                <div className="prop-key">Creator</div>
                <div className="prop-value">{purchase.video.creator.name}</div>
              </div>
              <div className="prop">
                <div className="prop-key">Bought At</div>
                <div className="prop-value">{formatDate(purchase.date)}</div>
              </div>
              {purchase.video.isDeleted && (
                <div className="deleted-note">
                  Note: This video has been deleted by the creator
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyPurchases;
