import React from "react";
import axios from "../../axiosInstance";
import "./style.css";

const EditVideo = ({
  videoId,
  setShowEdit,
  onSuccess,
  disable,
  setDisable,
}) => {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    type: "",
    video: "",
    price: "",
    url: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [editAlert, setEditAlert] = React.useState("");
  const [disableAll, setDisableAll] = React.useState(false);
  const [editSuccess, setEditSuccess] = React.useState(false);

  const token = localStorage.getItem("token");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setDisableAll(true);
    setDisable(true);

    const data = new FormData();
    if (formData.title) data.append("title", formData.title);
    if (formData.description) data.append("description", formData.description);
    if (formData.type) data.append("type", formData.type);
    if (formData.price) data.append("price", formData.price);
    if (formData.video) data.append("video", formData.video);
    if (formData.url) data.append("url", formData.url);

    try {
      const res = await axios.patch(
        `/api/videos/edit/${videoId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditSuccess(true);
      setEditAlert(res.data.message || "Video updated successfully.");
    } catch (err) {
      setEditAlert(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const handleOk = async () => {
    await onSuccess();
    setEditSuccess(false);
    setShowEdit(false);
    setEditAlert("");
    setDisableAll(false);
    setDisable(false);
  };

  return (
    <>
      <div className="edit-video-wrapper">
        <p className="top-instuction">
          All fields are optional. Fill only what you want to update.
        </p>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="prop">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              placeholder="Enter title"
              id="title"
              name="title"
              onChange={handleChange}
              value={formData.title}
              disabled={disableAll}
            />
          </div>
          <div className="prop">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              placeholder="Enter description"
              id="description"
              name="description"
              onChange={handleChange}
              value={formData.description}
              disabled={disableAll}
            />
          </div>
          <div className="prop">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              onChange={handleChange}
              value={formData.type}
              disabled={disableAll}
              className="select-option"
            >
              <option disabled value="">
                Select type
              </option>
              <option style={{ color: "black" }} value="long">
                Long
              </option>
              <option style={{ color: "black" }} value="short">
                Short
              </option>
            </select>
          </div>
          <div className="prop">
            <label htmlFor="price">Price(₹)</label>
            <input
              type="number"
              placeholder="Enter price"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              disabled={disableAll}
            />
          </div>
          <div className="prop">
            <label htmlFor="file">File</label>
            {formData.type === "short" ? (
              <input
                type="file"
                id="file"
                name="video"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    video: e.target.files[0],
                  }))
                }
                disabled={disableAll}
              />
            ) : (
              <input
                type="text"
                placeholder="Paste URL"
                name="url"
                onChange={handleChange}
                value={formData.url}
                disabled={disableAll}
              />
            )}
          </div>

          <div className="button-set">
            <button type="submit" disabled={disableAll}>
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button onClick={() => setShowEdit(false)} disabled={disableAll}>
              Cancel
            </button>
          </div>
        </form>
      </div>
      {editAlert && (
        <div className="message-overlay">
          <div className="message-box">
            <div className={`alert ${editSuccess ? "success" : "error"}`}>
              <p>{editAlert}</p>
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

export default EditVideo;
