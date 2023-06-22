import AppRouter from "./components/AppRouter";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <header>
        <Navbar />
      </header>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
