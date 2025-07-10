import React from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import axiosInstance from "../../axiosInstance"; 

const Register = () => {
  const navigate = useNavigate();
  const { fetchDetails, setLoggedIn, setUserChanged } = useUser();

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = React.useState(false);

  const [message, setMessage] = React.useState({
    green: "",
    red: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setMessage({ green: "", red: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    for (const key in formData) {
      if (formData[key].trim() === "") {
        newErrors[key] = `Enter valid ${key}`;
      } else {
        newErrors[key] = "";
      }
    }

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((ele) => ele !== "");
    if (hasError) return;

    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/user/register", formData);

      setMessage({ green: res.data.message, red: "" });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.id);

      setFormData({ name: "", email: "", password: "" });
      setLoggedIn(true);
      setUserChanged(true);
      await fetchDetails();
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || "Something went wrong. Please try again.";
      setMessage({ green: "", red: msg });
    } finally {
      setLoading(false);
    }
  };

  function handleOkClick() {
    if (message.green !== "") {
      navigate("/feed");
    }
    setMessage({ green: "", red: "" });
  }

  return (
    <div className="register-container">
      <h1 className="heading">Register your account</h1>
      <form onSubmit={handleSubmit}>
        <div className="element">
          <label htmlFor="name">Name:</label>
          <input
            onChange={handleChange}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            required
          />
        </div>

        <div className="element">
          <label htmlFor="email">Email:</label>
          <input
            onChange={handleChange}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            required
          />
        </div>

        <div className="element">
          <label htmlFor="password">Password:</label>
          <input
            onChange={handleChange}
            type="password"
            id="password"
            name="password"
            value={formData.password}
            required
          />
        </div>

        {(message.green || message.red) && (
          <div className="message-overlay">
            <div className="message-box">
              <div className="alert-box">
                <div className={`alert ${message.green ? "success" : "error"}`}>
                  <p>{message.green || message.red}</p>
                </div>
                <button className="alert-ok-btn" onClick={handleOkClick}>
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Submitting.." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
