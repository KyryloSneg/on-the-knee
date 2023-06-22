import navMenuIcon from "../assets/nav-menu.svg"

const NavMenuBtn = () => {

  function onClick() {
    // Open nav menu
  }

  return (
    <button 
      className="nav-mini-button" 
      aria-label="Navigation menu"
      onClick={onClick}
    >
      <img src={navMenuIcon} alt="Menu" className="no-select" draggable="false" />
    </button>
  );
}

export default NavMenuBtn;
