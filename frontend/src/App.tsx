import { Outlet } from "react-router-dom";
import Header from "./components/atomic/molecules/Header/Header";

export default function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
