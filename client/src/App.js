import AppRouter from "./components/AppRouter";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
import MyFooter from "./components/MyFooter";
import { useRef } from "react";

function App() {
  // ref for the "skip to next page content" btn
  const pageRef = useRef(null);

  return (
    <BrowserRouter>
      <header>
        <Navbar toFocusRef={pageRef} />
      </header>
      <AppRouter ref={pageRef} />
      <MyFooter />
    </BrowserRouter>
  );
}

export default App;
