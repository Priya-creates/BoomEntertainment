import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import axios from "./axiosInstance";
import "./App.css";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import VideoDetailsPage from "./pages/VideoDetailsPage/VideoDetailsPage";
import BuygiftPage from "./pages/BuygiftPage/BuygiftPage";
import EditVideo from "./components/EditVideo/EditVideo";
import Feed from "./pages/Feed/Feed";
import MyVideospage from "./pages/MyVideospage/MyVideospage";
import MyPurchasespage from "./pages/MyPurchasespage/MyPurchasespage";
import RechargeWalletpage from "./pages/RechargeWalletpage/RechargeWalletpage";
import UploadVideopage from "./pages/UploadVideoopage/UploadVideopage";
import CustomNavbar from "./components/CustomNavbar/CustomNavbar";

import UserProvider from "./context/UserContext";
import Layout from "./components/Layout/Layout";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import BackgroundSecond from "./components/BackgroundSecond/BackgroundSecond";
import Footer from "./components/Footer/Footer";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Login />;
};

const App = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("/api/ping")
        .then(() => console.log("🔁 Ping successful"))
        .catch((err) => {
          console.error("Ping failed:", err.message);
        });
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <UserProvider>
      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
              </>
            }
          />

          <Route
            path="/video/buyandgift/:videoId"
            element={
              <PrivateRoute>
                <>
                  <CustomNavbar />
                  <BackgroundSecond />
                  <BuygiftPage />
                </>
              </PrivateRoute>
            }
          />

          <Route element={<Layout />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/my-videos"
              element={
                <PrivateRoute>
                  <MyVideospage />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-purchases"
              element={
                <PrivateRoute>
                  <MyPurchasespage />
                </PrivateRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <PrivateRoute>
                  <UploadVideopage />
                </PrivateRoute>
              }
            />
            <Route
              path="/recharge-wallet"
              element={
                <PrivateRoute>
                  <RechargeWalletpage />
                </PrivateRoute>
              }
            />
            <Route
              path="/editvideo"
              element={
                <PrivateRoute>
                  <EditVideo />
                </PrivateRoute>
              }
            />
            <Route
              path="/video/details/:videoId"
              element={<VideoDetailsPage />}
            />
          </Route>

          <Route path="/bg" element={<BackgroundSecond />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
