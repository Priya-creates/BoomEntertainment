import React from "react";
import { useParams } from "react-router-dom";
import axios from "../../axiosInstance";
import AboutVideo from "../../components/AboutVideo/AboutVideo";
import "./style.css";
import { useUser } from "../../context/UserContext";

const BuygiftPage = () => {
  const { videoId } = useParams();
  const token = localStorage.getItem("token");
  const { fetchDetails, balance } = useUser();

  const [confirm, setConfirm] = React.useState({
    purchase: false,
    gift: false,
  });
  const [overlay, setOverlay] = React.useState({
    buy: { show: false, message: "", error: false },
    gift: { show: false, message: "", error: false },
  });
  const [giftAmount, setGiftAmount] = React.useState("");
  const [loading, setLoading] = React.useState({ buy: false, gift: false });

  const togglePurchase = () =>
    setConfirm((c) => ({ purchase: !c.purchase, gift: false }));
  const toggleGift = () =>
    setConfirm((c) => ({ purchase: false, gift: !c.gift }));

  const handlePurchase = async () => {
    setLoading((l) => ({ ...l, buy: true }));
    try {
      const res = await axios.post(
        `/api/videos/${videoId}/purchase`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOverlay((o) => ({
        ...o,
        buy: { show: true, message: res.data.message, error: false },
      }));
      await fetchDetails();
    } catch (err) {
      setOverlay((o) => ({
        ...o,
        buy: {
          show: true,
          message: err.response?.data?.message || "Purchase failed",
          error: true,
        },
      }));
    } finally {
      setLoading((l) => ({ ...l, buy: false }));
      setConfirm((c) => ({ ...c, purchase: false }));
    }
  };

  const handleGift = async () => {
    const amt = Number(giftAmount);
    if (amt < 10) {
      setOverlay((o) => ({
        ...o,
        gift: {
          show: true,
          message: "Please enter at least ₹10 to gift.",
          error: true,
        },
      }));
      return;
    }
    setLoading((l) => ({ ...l, gift: true }));
    try {
      const res = await axios.post(
        `/api/videos/${videoId}/gift`,
        { amount: amt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOverlay((o) => ({
        ...o,
        gift: { show: true, message: res.data.message, error: false },
      }));
      await fetchDetails();
    } catch (err) {
      console.log(err);
      setOverlay((o) => ({
        ...o,
        gift: {
          show: true,
          message: err.response?.data?.message || "Gift failed",
          error: true,
        },
      }));
    } finally {
      setLoading((l) => ({ ...l, gift: false }));
      setConfirm((c) => ({ ...c, gift: false }));
      setGiftAmount("");
    }
  };

  const closeBuyOverlay = () =>
    setOverlay((o) => ({ ...o, buy: { ...o.buy, show: false } }));
  const closeGiftOverlay = () =>
    setOverlay((o) => ({ ...o, gift: { ...o.gift, show: false } }));

  return (
    <>
      <div className="buygift-wrapper">
        <div className="buygift-box">
          <div className="about-video-container">
            <AboutVideo videoId={videoId} />
          </div>

          <div className="section">
            <h2 className="heading">Buy this video 💰</h2>
            <button
              onClick={togglePurchase}
              disabled={overlay.buy.show || overlay.gift.show}
            >
              Buy now
            </button>
            {confirm.purchase && (
              <div className="inline-confirm">
                <p>Are you sure you want to buy this video?</p>
                <div className="inline-buttons">
                  <button onClick={handlePurchase} disabled={loading.buy}>
                    {loading.buy ? "Processing..." : "Yes"}
                  </button>
                  <button
                    onClick={() =>
                      setConfirm((c) => ({ ...c, purchase: false }))
                    }
                    disabled={loading.buy}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="divider" />

          <div className="section">
            <h2 className="heading">Send gift to the creator 🎁</h2>
            <button
              onClick={toggleGift}
              disabled={overlay.buy.show || overlay.gift.show}
            >
              Gift now
            </button>
            {confirm.gift && (
              <div className="inline-confirm">
                <p>Enter gift amount (₹):</p>
                <input
                  type="number"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  disabled={loading.gift}
                  style={{ marginBottom: "2rem" }}
                />
                <div className="inline-buttons">
                  <button onClick={handleGift} disabled={loading.gift}>
                    {loading.gift ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    onClick={() => setConfirm((c) => ({ ...c, gift: false }))}
                    disabled={loading.gift}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlays */}
      {overlay.buy.show && (
        <div className="message-overlay">
          <div className="message-box">
            <div className={`alert ${overlay.buy.error ? "error" : "success"}`}>
              <p>{overlay.buy.message}</p>
              <div>
                {!overlay.buy.error && (
                  <p className="remaining-balance">
                    Remaining balance: ₹{balance}
                  </p>
                )}
              </div>
            </div>
            <button className="ok-btn" onClick={closeBuyOverlay}>
              OK
            </button>
          </div>
        </div>
      )}

      {overlay.gift.show && (
        <div className="message-overlay">
          <div className="message-box">
            <div
              className={`alert ${overlay.gift.error ? "error" : "success"}`}
            >
              <p>{overlay.gift.message}</p>
              <div>
                {!overlay.gift.error && (
                  <p className="remaining-balance">
                    Remaining balance: ₹{balance}
                  </p>
                )}
              </div>
            </div>
            <button className="ok-btn" onClick={closeGiftOverlay}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BuygiftPage;
