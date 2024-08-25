// GlobalState.js
import React, { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import useLocalStorage from "../components/useLocalStorage";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storedId, setStoredId] = useLocalStorage("ID", "");
  const [userType, setUserType] = useLocalStorage("userType", "student");
  const [adviserData, setAdviserData] = useState([]);
  const [adviser, setAdviser] = useState(null);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // Fetch user data when storedId or userType changes
  useEffect(() => {
    if (storedId && userType) {
      fetchUser();
    }
  }, [storedId, userType]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("https://gp-back-end-23b2cebb8602.herokuapp.com/");

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      if (storedId) {
        newSocket.emit("joinRoom", storedId);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    newSocket.on("ticketCreated", (data) => {
      console.log("Ticket created: ", data);
      fetchUser();
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [storedId]);

  // Fetch advisers data
  const fetchAdvisers = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://gp-back-end-23b2cebb8602.herokuapp.com/api/ticket/advisersData"
      );
      setAdviserData(response.data);
    } catch (error) {
      console.error("Error fetching advisers data: ", error);
      setError(error.message);
    }
  }, []);

  // Create a new ticket
  const handleCreateTicket = useCallback(
    async (title, selectedHour, selectedMinute, expectedDuration) => {
      const newTimeStamp = new Date().toISOString();
      const newDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        weekday: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
      const adviserName = adviser?.username;
      const studentName = userData?.username;

      try {
        await axios.put(
          "https://gp-back-end-23b2cebb8602.herokuapp.com/api/ticket/user/createTicket",
          {
            studentId: userData?.id,
            adviserId: adviser?._id,
            adviserName,
            studentName,
            title,
            timeStamp: newTimeStamp,
            date: newDate,
            storedId,
            selectedHour,
            selectedMinute,
            expectedDuration,
          }
        );
      } catch (error) {
        console.log(userData);
        console.log(adviser);
        console.error("Error creating ticket:", error);
        setError(error.message);
      }
    },
    [userData, adviser, storedId]
  );

  // Fetch user data
  const fetchUser = useCallback(async () => {
    if (!storedId || !userType) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `https://gp-back-end-23b2cebb8602.herokuapp.com/api/ticket/user/${storedId}?userType=${userType}`
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError(error.message || "Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  }, [storedId, userType]);

  return (
    <GlobalContext.Provider
      value={{
        userData,
        setUserData,
        storedId,
        setStoredId,
        fetchUser,
        navigate,
        handleCreateTicket,
        loading,
        error,
        userType,
        setUserType,
        fetchAdvisers,
        adviserData,
        setAdviserData,
        adviser,
        setAdviser,
        socket,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
