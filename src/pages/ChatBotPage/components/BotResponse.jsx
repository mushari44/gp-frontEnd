import React, { useState } from "react";
import copyIcon from "../assets/copy.svg";
import checkIcon from "../assets/check.svg"; // New checkmark icon
import likeIcon from "../assets/like.svg";
import disLikeIcon from "../assets/dislike.svg";
import Loader from "./Loader.jsx";
import ChatBotIcon from "../assets/chatbot-icon.png";

const BotResponse = ({ response, timestamp, chatBotLoading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(response)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const formatResponse = (text) => {
    if (text === null) return null;
    const lines = text.split("\n");
    const formatted = [];

    lines.forEach((line) => {
      if (line.startsWith("###")) {
        formatted.push(
          <h3 key={line} className="text-xl font-semibold mt-4">
            {line.replace("###", "").trim()}
          </h3>
        );
      } else if (line.startsWith("-")) {
        formatted.push(
          <li key={line} className="ml-4 list-disc">
            {line.replace("-", "").trim()}
          </li>
        );
      } else if (line.trim() !== "") {
        formatted.push(
          <p key={line} className="mt-2">
            {line.trim()}
          </p>
        );
      }
    });

    return formatted;
  };

  const formattedResponse = formatResponse(response);

  return response ? (
    <div className="Bot-Response">
      <div className="Time-Icon">
        <img src={ChatBotIcon} alt="chatBot icon" className="min-w-20 h-20" />
        <div>
          <h2 className="text-lg">MentorBot</h2>
          <p className="text-sm">{timestamp}</p>
        </div>
      </div>
      <div
        className="bg-gray-100 p-4 rounded-md mb-2 Response-Container"
        style={{
          direction: "auto", // Allow the browser to auto-detect text direction
          unicodeBidi: "plaintext", // Enable inline directionality for mixed content
        }}
      >
        <div className="Response text-lg">{formattedResponse}</div>
      </div>

      <div className="flex space-x-2 items-center">
        {/* Copy Button */}
        <button
          className="rounded-lg text-token-text-secondary hover:bg-token-main-surface-secondary"
          aria-label="Copy"
          onClick={handleCopy}
        >
          <span className="flex items-center justify-center h-[30px] w-[30px]">
            <img
              src={copied ? checkIcon : copyIcon} // Toggle icons
              alt={copied ? "Check Icon" : "Copy Icon"}
            />
          </span>
        </button>

        {/* Like Button */}
        <button
          className="rounded-lg text-token-text-secondary hover:bg-token-main-surface-secondary"
          aria-label="Like"
        >
          <span className="flex items-center justify-center h-[30px] w-[30px]">
            <img src={likeIcon} alt="Like Icon" />
          </span>
        </button>

        {/* Dislike Button */}
        <button
          className="rounded-lg text-token-text-secondary hover:bg-token-main-surface-secondary"
          aria-label="Dislike"
        >
          <span className="flex items-center justify-center h-[30px] w-[30px]">
            <img src={disLikeIcon} alt="Dislike Icon" />
          </span>
        </button>
      </div>
    </div>
  ) : (
    <div className="loader">
      <div className="bg-color text-white rounded-md p-4">
        {chatBotLoading ? <Loader /> : null}
      </div>
    </div>
  );
};

export default BotResponse;
