import React from "react";
import "./style.css";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";

const Login = () => {
  const { fetchDetails, setLoggedIn, setUserChanged } = useUser();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [errors, setErrors] = React.useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState({
    green: "",
    red: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage({ green: "", red: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    for (const key in formData) {
      if (formData[key].trim() === "") {
        newErrors[key] = `Enter valid ${key}`;
      } else if (key === "email" && !formData.email.match(/^\S+@\S+\.\S+$/)) {
        newErrors.email = "Enter valid email address";
      } else {
        newErrors[key] = "";
      }
    }

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((ele) => ele !== "");
    if (hasError) return;

    setLoading(true);

    try {
      const response = await axiosInstance.post("/api/user/login", formData);

      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      setMessage({ green: data.message, red: "" });
      setFormData({ email: "", password: "" });
      setLoggedIn(true);
      setUserChanged(true);

      await fetchDetails();
    } catch (err) {
      console.log("ERROR:", err);
      const msg =
        err.response?.data?.message || "Something went wrong. Please try again.";
      setMessage({ green: "", red: msg });
    } finally {
      setLoading(false);
    }
  }

  function handleOkClick() {
    if (message.green !== "") {
      navigate("/feed");
    }
    setMessage({ green: "", red: "" });
  }

  return (
    <>
      <div className="login-container">
        <h1 className="heading">Login into your account</h1>
        <form onSubmit={handleSubmit}>
          <div className="element">
            <label htmlFor="email">Email:</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              id="email"
              value={formData.email}
              disabled={loading}
              required
            />
          </div>

          <div className="element">
            <label htmlFor="password">Password:</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              id="password"
              value={formData.password}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || message.green || message.red}
            className="submit-btn"
          >
            {loading ? "Submitting.." : "Login"}
          </button>
        </form>
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
    </>
  );
};

export default Login;
