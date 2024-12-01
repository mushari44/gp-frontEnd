import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { GlobalContext } from "../context";

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {
    userType,
    setUserType,
    setUserData,
    setStoredId,
    navigate,
    fetchUser,
  } = useContext(GlobalContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:4000/api/auth/login", {
        id,
        password,
        userType,
      });
      const data = res.data;
      setUserData(data.user);
      setStoredId(data.user._id);
      setUserType(userType);
      setError("");
      console.log(data);
      if (data.user.availableTimes === null) {
        navigate("/profile"); // Navigate to tickets
      } else {
        navigate("/tickets"); // Navigate to tickets
      }
      console.log(userType);
    } catch (err) {
      setError(err.response.data.message);
    }
  };
  return (
    <div className="flex items-center justify-center  ">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full py-2 mt-4 font-bold text-white bg-gray-600 rounded-lg hover:bg-gray-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
