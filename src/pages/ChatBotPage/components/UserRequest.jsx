import React, { useState } from "react";
import UserIcon from "../assets/user.png";
import editIcon from "../assets/edit-text.svg";

const UserReq = ({ query, timestamp, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(query);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editedMessage.trim()) return;
    onUpdate(editedMessage);
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedMessage(query);
    setEditing(false);
  };

  return (
    <div
      className={`rounded-md mb-2 User-Chat p-2 ${
        editing ? "bg-yellow-100" : ""
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* User Icon and Timestamp */}
        <div className="flex flex-col items-center space-y-1">
          <img src={UserIcon} alt="User" className="w-8 h-8" />
          <p className="text-sm">{timestamp}</p>
        </div>

        {/* Query and Edit Button */}
        <div className="flex-1 group relative">
          {editing ? (
            <div className="flex items-center">
              <input
                type="text"
                className="User-Query p-2 border rounded-md flex-1"
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                style={{
                  direction: "auto", // Allow the browser to auto-detect text direction
                  unicodeBidi: "plaintext", // Enable inline directionality for mixed content
                }}
              />
              <button
                onClick={handleSaveEdit}
                className="ml-2 text-green-500 hover:text-green-600"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="ml-2 text-red-500 hover:text-red-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <p
              className="User-Query"
              style={{
                direction: "auto", // Allow the browser to auto-detect text direction
                unicodeBidi: "plaintext", // Enable inline directionality for mixed content
              }}
            >
              {query}
            </p>
          )}
          {!editing && (
            <button
              aria-label="Edit message"
              className="Edit-Button absolute right-0 top-0 hidden group-hover:inline-block"
              onClick={handleEdit}
            >
              <img src={editIcon} alt="Edit" className="Edit-Icon" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReq;
