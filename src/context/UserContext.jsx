import axios from "../axiosInstance";
import React, { createContext, useEffect, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [balance, setBalance] = useState();
  const [name, setName] = useState("");
  const [loggedIn, setLoggedIn] = React.useState(
    !!localStorage.getItem("token")
  );
  const [userChanged, setUserChanged] = useState(false);
  const [userId, setUserId] = useState(null);

  async function fetchDetails() {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(
        `/api/user/nav-details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      

      setBalance(res.data.wallet);
      setName(res.data.name);
      setUserId(res.data.id);
    } catch (err) {
      console.log("Failed to fetch user nav details", err);
    }
  }

  useEffect(() => {
    fetchDetails();
  }, [loggedIn]);

  return (
    <UserContext.Provider
      value={{
        fetchDetails,
        balance,
        name,
        setName,
        loggedIn,
        setLoggedIn,
        setUserChanged,
        userChanged,
        userId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUser = () => React.useContext(UserContext);
