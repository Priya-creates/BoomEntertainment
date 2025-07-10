import React from "react";
import axios from "../../axiosInstance";
import "./style.css";

const UploadVideo = () => {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    type: "long",
    price: "",
    video: "",
    url: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [uploadAlert, setUploadAlert] = React.useState("");
  const [formErrors, setFormErrors] = React.useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.type) errors.type = "Type is required";
    if (formData.type === "short" && !formData.video) errors.video = "Video file is required";
    if (formData.type === "long" && !formData.url.trim()) errors.url = "URL is required";
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("title", formData.title);
    if (formData.description) data.append("description", formData.description);
    data.append("type", formData.type);
    if (formData.price) data.append("price", formData.price);
    if (formData.type === "short") data.append("video", formData.video);
    if (formData.type === "long") data.append("url", formData.url);

    try {
      setLoading(true);
      const res = await axios.post("/api/videos/upload", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploadAlert(res.data.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setFormData({
        title: "",
        description: "",
        type: "long",
        price: "",
        video: "",
        url: "",
      });
    } catch (err) {
      setUploadAlert(err.response?.data?.message || "Upload failed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setFormData({
      title: "",
      description: "",
      type: "long",
      price: "",
      video: "",
      url: "",
    });
    setFormErrors({});
  }

  function handleOk() {
    setUploadAlert("");
  }

  return (
    <>
      <div className="upload-container">
        <h1 className="heading">Upload a New Video</h1>
        <form onSubmit={handleSubmit}>
          <div className="element">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={loading}
            />
            <p className="formError-box">{formErrors.title}</p>
          </div>

          <div className="element">
            <label htmlFor="type">Type:</label>
            <select
              name="type"
              id="type"
              onChange={handleChange}
              value={formData.type}
              disabled={loading}
            >
              <option disabled value="">Select type</option>
              <option value="short">Short</option>
              <option value="long">Long</option>
            </select>
            <p className="formError-box">{formErrors.type}</p>
          </div>

          <div className="element">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              placeholder="(optional)"
            />
          </div>

          <div className="element">
            <label htmlFor="price">Price (₹):</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              disabled={loading}
              placeholder="(optional)"
            />
          </div>

          <div className="element">
            <label>File / URL:</label>
            {formData.type === "short" ? (
              <>
                <input
                  type="file"
                  name="video"
                  disabled={loading}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      video: e.target.files[0],
                    }))
                  }
                />
                <p className="formError-box">{formErrors.video}</p>
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Paste video URL"
                />
                <p className="formError-box">{formErrors.url}</p>
              </>
            )}
          </div>

          <div className="button-set">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Uploading..." : "Upload"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {uploadAlert && (
        <div className="message-overlay">
          <div className="message-box">
            <div className="alert success">
              <p>{uploadAlert}</p>
            </div>
            <button className="alert-ok-btn" onClick={handleOk}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadVideo;
