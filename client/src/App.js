import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <span>
        Navbar
      </span>
      <Outlet />
    </div>
  );
}

export default App;
