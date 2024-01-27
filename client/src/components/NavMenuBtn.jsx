import { useContext, useEffect, useRef } from "react";
import navMenuIcon from "../assets/nav-menu.svg"
import NavIconBtn from "./UI/navIconBtn/NavIconBtn";
import { Context } from "../Context";
import setMenuVisibility from "../utils/setMenuVisibility";

const NavMenuBtn = () => {
  const { app } = useContext(Context);
  const menuShortcutRef = useRef(null);

  function onClick() {
    // Open nav menu
    setMenuVisibility(true, app);
  }

  useEffect(() => {
    app.setMenuShortcutRef(menuShortcutRef);
  }, [app]);

  return (
    <NavIconBtn 
      src={navMenuIcon} 
      alt="Menu" 
      aria-label="Navigation menu" 
      onClick={onClick} 
      ref={menuShortcutRef}
    />
  );
};

export default NavMenuBtn;
