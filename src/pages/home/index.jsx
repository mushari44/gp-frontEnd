import { useContext } from "react";
import { GlobalContext } from "../../context";
export default function Home() {
  const { navigate } = useContext(GlobalContext);
  return (
    <button className=" border-2 text-white" onClick={() => navigate("/login")}>
      login ?
    </button>
  );
}
