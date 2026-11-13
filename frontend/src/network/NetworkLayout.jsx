import { Outlet } from "react-router-dom";
import Background from "./components/Background";
import "./network.css";

export default function NetworkLayout() {
  return (
    <div className="nb-root">
      <Background />
      <Outlet />
    </div>
  );
}
