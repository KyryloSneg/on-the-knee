import Navbar from "./components/Navbar";
import "./App.css";
import MyFooter from "./components/MyFooter";
import { useRef } from "react";
import { Outlet } from "react-router-dom";

function App() {
  // ref for the "skip to next page content" btn
  const pageRef = useRef(null);

  return (
    <div>
      <header>
        <Navbar toFocusRef={pageRef} />
      </header>
      <Outlet context={pageRef} />
      <MyFooter />
    </div>  
  );
}

export default App;
