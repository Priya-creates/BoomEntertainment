import React from "react";
import axios from "../../axiosInstance";
import "./style.css";

const DeleteVideo = ({
  videoId,
  setDeleteId,
  onSuccess,
  setDeleteInProgress,
  setShowDelete,
}) => {
  const [step, setStep] = React.useState("confirm");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [deleteSuccess, setDeleteSuccess] = React.useState(false);

  const token = localStorage.getItem("token");

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await axios.patch(
        `/api/videos/delete/${videoId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDeleteSuccess(true);
      setMessage(res.data.message || "Video deleted successfully.");
      setStep("message");
      setDeleteInProgress(true);
    } catch (err) {
      setDeleteSuccess(false);
      setMessage(err.response?.data?.message || "Something went wrong.");
      setStep("message");
      setDeleteInProgress(true);
    } finally {
      setLoading(false);
    }
  }

  const handleMessageOk = async () => {
    await onSuccess();
    setStep("confirm");
    setMessage("");
    setDeleteId(null);
    setDeleteInProgress(false);
  };

  return (
    <>
      <div className="delete-video-wrapper">
        {step === "confirm" && (
          <div className="inner-container">
            <p className="question">Are you sure you want to delete this video?</p>
            <div className="button-set">
              <button onClick={handleDelete} disabled={loading}>
                {loading ? "Deleting..." : "Yes"}
              </button>
              <button
                onClick={() => {
                  setDeleteId(null);
                  setShowDelete(false);
                }}
                disabled={loading}
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>

      {step === "message" && (
        <div className="message-overlay">
          <div className="message-box">
            <div className={`alert ${deleteSuccess ? "success" : "error"}`}>
              <p>{message}</p>
            </div>
            <button className="alert-ok-btn" onClick={handleMessageOk}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteVideo;
