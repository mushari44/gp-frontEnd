import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  AiFillStar,
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
} from "react-icons/ai";
import { FaRobot } from "react-icons/fa6";
import { CgFileDocument } from "react-icons/cg";
import { GlobalContext } from "../../context";
const NavBar = () => {
  const { userType } = useContext(GlobalContext);

  return (
    <>
      <div
        className={`bg-gradient-to-r z-10 animate-gradient-x py-1 shadow-2xl fixed top-0 left-0 right-0 w-full backdrop-blur-md shadow-current`}
      >
        <nav className="navbar flex flex-col items-center justify-center h-16 max-w-6xl mx-auto space-y-3 sm:flex-row sm:space-y-0 sm:justify-between sm:h-20">
          <Link to={"/"}>
            <div className="text-center sm:text-left sm:w-full ">
              <h1 className="cursor-pointer text-white transition-transform transform hover:scale-110">
                Graduation Project
              </h1>
            </div>
          </Link>
          <ul className="flex list-none items-center space-x-6 text-white font-semibold">
            <Link to={"/ChatBot"} className="group hover:text-gray-500">
              <li className="cursor-pointer transition-transform transform hover:scale-110 relative flex items-center space-x-1">
                <AiOutlineHome /> <span>Home</span>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-500 group-hover:w-full"></span>
              </li>
            </Link>
            <Link to={"/Login"}>
              <div className="text-center sm:text-left sm:w-full ">
                <h1 className="cursor-pointer text-white transition-tr  ansform transform hover:scale-110">
                  Login
                </h1>
              </div>
            </Link>
            <Link to={"/ChatBot"} className="group hover:text-gray-500">
              <li className="cursor-pointer transition-transform transform hover:scale-110 relative flex items-center space-x-1">
                <FaRobot /> <span>ChatBot</span>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-500 group-hover:w-full"></span>
              </li>
            </Link>
            <Link to={"/createTicket"} className="group hover:text-gray-500">
              <li className="cursor-pointer transition-transform transform hover:scale-110 relative flex items-center space-x-2">
                <CgFileDocument style={{ marginBottom: "2px" }} />{" "}
                <span>Create Ticket</span>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-500 group-hover:w-full"></span>
              </li>
            </Link>
            <Link to={"/tickets"} className="group hover:text-gray-500">
              <li className="cursor-pointer transition-transform transform hover:scale-110 relative flex items-center space-x-2">
                <AiOutlineUser /> <span>Tickets</span>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-500 group-hover:w-full"></span>
              </li>
            </Link>
            {userType === "Admin" ? (
              <Link to={"/asign"} className="group hover:text-gray-500">
                <li className="cursor-pointer transition-transform transform hover:scale-110 relative flex items-center space-x-2">
                  <AiOutlineUser /> <span>asing students</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-500 group-hover:w-full"></span>
                </li>
              </Link>
            ) : null}
          </ul>
        </nav>
      </div>
      <div className="pt-24 ">{}</div>
    </>
  );
};

export default NavBar;
