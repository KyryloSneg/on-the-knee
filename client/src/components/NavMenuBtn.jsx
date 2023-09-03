import navMenuIcon from "../assets/nav-menu.svg"
import NavIconBtn from "./UI/navIconBtn/NavIconBtn";

const NavMenuBtn = () => {

  function onClick() {
    // Open nav menu
  }

  return (
    <NavIconBtn src={navMenuIcon} alt="Menu" aria-label="Navigation menu" onClick={onClick} />
  );
}

export default NavMenuBtn;
