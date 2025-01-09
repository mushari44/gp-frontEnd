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
  const [studentsData, setStudentsData] = useState([]);
  const [adviser, setAdviser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [freeTime, setFreeTime] = useState([]);
  const [tickets, setTickets] = useState([]); 
  const [availableDurations, setAvailableDurations] = useState([{}]);
  const [fromTime, setFromTime] = useState(null);
  const [fromTime2, setFromTime2] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [toTime2, setToTime2] = useState(null);
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatBotLoading, setChatBotLoading] = useState(false);
  const [expectedDuration, setExpectedDuration] = useState(0);
  const [daysAndTimes, setDaysAndTimes] = useState([
    { day: "", hours: { start: null, end: null } },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    if (storedId && userType) {
      fetchUser();
    }
    
  }, [storedId, userType]);
  // const newSocket = io("http://127.0.0.1:4000");

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://127.0.0.1:4000");

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

  const fetchAdvisers = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:4000/api/ticket/advisersData"
      );
      setAdviserData(response.data);
      console.log("adviser  : ", response.data);
    } catch (error) {
      console.error("Error fetching advisers data: ", error);
      setError(error.message);
    }
  }, []);
  const fetchStudents = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:4000/api/ticket/studentsData"
      );
      setStudentsData(response.data);
      console.log("STUDENTS DATA !  : ", response.data);
    } catch (error) {
      console.error("Error fetching students data: ", error);
      setError(error.message);
    }
  }, []);
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
        const response = await axios.put(
          "http://127.0.0.1:4000/api/ticket/user/createTicket",
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
        `http://127.0.0.1:4000/api/ticket/user/${storedId}?userType=${userType}`
      );
      setUserData(response.data);
      setTickets(response.data.tickets || []); // Update tickets state with fetched tickets
      console.log("TEST fetch userTYPE  : ",userType ," with data  : ", response.data);

      
      if (userType === "adviser" && (response.data.availableTimes===null||response.data.availableTimes===undefined)) {
        console.log("NAVIGATE TO PROFILE in context");

        navigate("/profile");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setError(error.message || "Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  }, [storedId, userType]);

  const generateTimestamp = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  const handleSend = async (e) => {
    if (e) e.preventDefault();

    if (!query.trim()) {
      alert("Please enter a message.");
      return;
    }
    console.log("QUE ", query);

    const timestamp = generateTimestamp();
    const userMessage = { type: "user", text: query.trim(), timestamp };

    setChatHistory((prev) => [
      ...prev,
      { query, response: null, timestamp: timestamp },
    ]);
    setQuery("");
    setChatBotLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:4000/api/ticket/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage.text }),
      });

      const data = await response.json();
      const botTimestamp = generateTimestamp();
      console.log("DATA : ", data.reply);
      setChatHistory((prev) =>
        prev.map((chat, index) =>
          index === prev.length - 1
            ? { ...chat, response: data.reply, botTimestamp }
            : chat
        )
      );
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      const errorTimestamp = generateTimestamp();
      setChatHistory((prev) =>
        prev.map((chat, index) =>
          index === prev.length - 1
            ? {
                ...chat,
                response:
                  "حدث خطأ أثناء معالجة استفسارك. الرجاء المحاولة مرة أخرى.",
                botTimestamp: errorTimestamp,
              }
            : chat
        )
      );
    } finally {
      setChatBotLoading(false);
    }
  };

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
        freeTime,
        setFreeTime,
        tickets,
        availableDurations,
        setAvailableDurations,
        fromTime,
        setFromTime,
        fromTime2,
        setFromTime2,
        toTime,
        setToTime,
        toTime2,
        setToTime2,
        fetchStudents,
        studentsData,
        query,
        setQuery,
        chatHistory,
        setChatHistory,
        generateTimestamp,
        handleSend,
        setChatBotLoading,
        chatBotLoading,
        daysAndTimes,
        setDaysAndTimes,
        expectedDuration,
        setExpectedDuration,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
