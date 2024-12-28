import React, { useState, useContext } from "react";
import axios from "axios";
import { GlobalContext } from "../context";

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { userType, setUserType, setUserData, setStoredId, navigate } =
    useContext(GlobalContext);
  const [tempUserType, setTempUserType] = useState("student");
  const handleSubmit = async (e) => {
    setUserType(tempUserType);
    // console.log("TEMP : ", tempUserType);

    e.preventDefault();
    setLoading(true);
    setError("");
    // console.log("user Type : ", userType);

    try {
      const res = await axios.post("http://127.0.0.1:4000/api/auth/login", {
        id,
        password,
        userType: tempUserType,
      });
      const data = res.data;
      setUserData(data.user);
      setStoredId(data.user._id);
      if (data.user.availableTimes === null) {
        navigate("/profile");
      } else {
        navigate("/tickets");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-100 ">
      <div className="flex flex-row w-4/5 max-w-6xl h-5/6 bg-white rounded-lg shadow-lg">
        {/* Left Section: Image */}
        <div className="hidden lg:flex w-1/2 bg-cover bg-center login-image"></div>

        {/* Right Section: Login Form */}
        <div className="flex items-center justify-center w-full lg:w-1/2 px-6 py-12 bg-gray-50">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-extrabold text-center text-gray-800">
              Welcome Back
            </h2>
            <p className="text-center text-gray-500">
              Log in to your account to continue.
            </p>
            {error && (
              <p className="mt-4 text-center text-red-500 bg-red-100 rounded py-2">
                {error}
              </p>
            )}
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label
                  htmlFor="id"
                  className="block text-sm font-medium text-gray-700"
                >
                  {tempUserType === "student" ? "Student" : "Adviser"} ID
                </label>
                <input
                  id="id"
                  type="text"
                  placeholder={`Enter your ${tempUserType} ID`}
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="userType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select User Type
                </label>
                <select
                  id="userType"
                  value={tempUserType}
                  onChange={(e) => setTempUserType(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="student">Student</option>
                  <option value="adviser">Adviser</option>
                  <option value="Admin">Admin </option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 font-bold text-white rounded-lg transition ${
                  loading
                    ? "bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="w-full py-2 mt-4 font-bold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
