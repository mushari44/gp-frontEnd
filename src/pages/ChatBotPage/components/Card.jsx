import React, { useState, useEffect, useRef, useContext } from "react";
import BotResponse from "./BotResponse";
import UserReq from "./UserRequest";
import WelcomeMessage from "./WelcomeMessage";
import SendIcon from "../assets/send.png";
import { GlobalContext } from "../../../context";
import "../style.css";

const ChatCard = () => {
  const {
    query,
    setQuery,
    chatHistory,
    setChatHistory,
    handleSend,
    generateTimestamp,
    chatBotLoading,
  } = useContext(GlobalContext);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const chatContainerRef = useRef(null);
  const textAreaRef = useRef(null); // Reference to the textarea

  useEffect(() => {
    if (chatContainerRef.current && chatHistory.length) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    } else {
      chatContainerRef.current.scrollTop = 0;
    }
  }, [chatHistory]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    const textarea = textAreaRef.current;
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const resetTextAreaHeight = () => {
    const textarea = textAreaRef.current;
    textarea.style.height = "auto"; // Reset height to auto before setting the new value
  };

  const handleSubmit = (e) => {
    handleSend(e);
    resetTextAreaHeight();
  };
  console.log("CHAT BOT Loading ", chatBotLoading);

  return (
    <div className="flex items-center justify-center  p-10 bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-11/12 md:w-2/3 lg:w-1/2 p-6">
        <div
          ref={chatContainerRef}
          className="border border-gray-300 rounded-md h-96 mt-4 p-4 overflow-y-auto Chat-Container"
        >
          <WelcomeMessage timestamp={generateTimestamp()} />

          {chatHistory.map((chat, index) => (
            <div key={index}>
              {console.log("CHAT : ", chat)}
              <UserReq
                query={chat.query}
                timestamp={chat.timestamp}
                onUpdate={(newQuery) => {
                  const updatedChatHistory = [...chatHistory];
                  updatedChatHistory[index].query = newQuery;
                  setChatHistory(updatedChatHistory);
                }}
              />
              <BotResponse
                response={chat.response}
                timestamp={chat.timestamp}
                chatBotLoading={chatBotLoading}
              />
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex items-center p-3 rounded-md border border-gray-300 focus-within:ring-gray-200 focus-within:ring-1">
            <textarea
              ref={textAreaRef}
              className="flex-1 bg-transparent outline-none placeholder-gray-400 resize-none max-h-40"
              placeholder="سراج... لأن المعرفة تبدأ بسؤال"
              value={query}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSubmit(e);
                }
              }}
              style={{
                direction: "auto", // Allow the browser to auto-detect text direction
                unicodeBidi: "plaintext", // Enable inline directionality for mixed content
              }}
            />
            <button
              type="submit"
              disabled={chatBotLoading}
              className="ml-2 text-blue-500 hover:text-blue-600 transition duration-300"
            >
              <img src={SendIcon} className="SendIcon" alt="Send" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatCard;
