import AppRouter from "./components/AppRouter";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
import MyFooter from "./components/MyFooter";

function App() {
  return (
    <BrowserRouter>
      <header>
        <Navbar />
      </header>
      <AppRouter />
      <MyFooter />
    </BrowserRouter>
  );
}

export default App;
