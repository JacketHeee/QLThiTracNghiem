import { Outlet } from "react-router-dom";
import Header from "./components/atomic/molecules/Header/Header";

// tesst pull request
export default function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
