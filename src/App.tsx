import { Outlet } from "react-router-dom";
import Header from "./components/atomic/molecules/Header/Header";

// pnpm pull request
export default function App() {
  return (
    <>
      <Header />
      Cuộc sống màaaaaa
      <Outlet />
    </>
  );
}
