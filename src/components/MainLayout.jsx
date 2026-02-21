import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function MainLayout() {
  return (
    <>
      <NavBar />
      <main style={{ padding: "16px" }}>
        <Outlet />
      </main>
    </>
  );
}
