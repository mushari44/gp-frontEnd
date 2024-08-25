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
  const [freeTime, setFreeTime] = useState([]);
  const [tickets, setTickets] = useState([]); // State to store tickets

  const navigate = useNavigate();

  useEffect(() => {
    if (storedId && userType) {
      fetchUser();
    }
  }, [storedId, userType]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("https://gp-back-end-23b2cebb8602.herokuapp.com");

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      // Join the room for the current user
      newSocket.emit("joinRoom", { userId: storedId });
    });

    newSocket.on("ticketCreated", (ticketDetails) => {
      console.log("New  Ticket created: ", ticketDetails);
      // Update tickets state with the new ticket
      setTickets((prevTickets) => [ticketDetails, ...prevTickets]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [storedId]);

  // Fetch advisers data
  async function fetchFreeTime() {
    try {
      const response = await axios.get(
        "https://gp-back-end-23b2cebb8602.herokuapp.com/api/ticket/getHours"
      );
      const data = response.data;
      setFreeTime(data);
      console.log("get hours endpoint : ", data);
    } catch (error) {
      console.log("Time error: ", error);
    }
  }

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
    async (title, course, selectedHour, selectedMinute, expectedDuration) => {
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
        // Create the ticket
        const response = await axios.put(
          "https://gp-back-end-23b2cebb8602.herokuapp.com/api/ticket/user/createTicket",
          {
            studentId: storedId,
            adviserId: adviser?._id,
            adviserName,
            studentName,
            title,
            course,
            timeStamp: newTimeStamp,
            date: newDate,
            storedId,
            selectedHour,
            selectedMinute,
            expectedDuration,
          }
        );
        console.log(response.data);

        const newTicket = response.data;

        // Emit ticketCreated event to notify about the new ticket
        if (socket) {
          socket.emit("ticketCreated", {
            studentId: storedId,
            adviserId: adviser?._id,
            studentTicket: newTicket.studentTicket,
            adviserTicket: newTicket.adviserTicket,
          });
        }
      } catch (error) {
        console.error("Error creating ticket:", error);
        setError(error.message);
      }
    },
    [userData, adviser, storedId, socket]
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
      setTickets(response.data.tickets || []); // Update tickets state with fetched tickets
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
        fetchFreeTime,
        freeTime,
        tickets, // Expose tickets state to the context
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
