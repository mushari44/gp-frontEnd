import React, { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { GlobalContext } from "../context";

const Register = () => {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { navigate, userType, setUserType } = useContext(GlobalContext);
  const [selectedHour, setSelectedHour] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:4000/api/auth/register", {
        id,
        password,
        username,
        userType,
      });
      setSuccess(res.data.message);
      setUserType(userType);
      setError("");
    } catch (err) {
      setSuccess("");
      setError(err.response.data.message);
    }
  };
  console.log(selectedHour);

  return (
    <div className="flex items-center justify-center  ">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            placeholder="Enter your Student Id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          {userType === "adviser" ? (
            <div className="flex-col items-center text-center ">
              <p className="mb-4">Select your office hours</p>
              <div className="flex gap-2 items-center">
                <label htmlFor="from" id="from">
                  from
                </label>
                <input
                  id="from"
                  type="time"
                  onChange={(e) => setSelectedHour(e.target.value)}
                  className="w-2/5 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                to
                <input
                  type="time"
                  className="w-2/5 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          ) : null}
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="student">Student</option>
            <option value="adviser">Adviser</option>
          </select>
          <button
            type="submit"
            className="w-full py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        <button
          onClick={() => navigate("/login")}
          className="w-full py-2 mt-4 font-bold text-white bg-gray-600 rounded-lg hover:bg-gray-700"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Register;
