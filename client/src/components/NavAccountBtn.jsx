import accBtnIcon from "../assets/acc-button.svg";
import "./styles/NavAccountBtn.css";

const NavAccountBtn = () => {

  function onClick() {
    // open login-registration modal window or link to the user cabinet page
  }

  return (
    <button 
      className="acc-button nav-mini-button" 
      aria-label="Your account"
      onClick={onClick}
    >
      <img src={accBtnIcon} draggable="false" className="no-select" alt="Account" />
    </button>
  );
}

export default NavAccountBtn;
