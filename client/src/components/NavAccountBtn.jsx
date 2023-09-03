import accBtnIcon from "../assets/acc-button.svg";
import homeIcon from "../assets/home.svg";
import NavIconBtn from "./UI/navIconBtn/NavIconBtn";
import "./styles/NavAccountBtn.css";
import { USER_ROUTE } from "../utils/consts";
import { useContext } from "react";
import { Context } from "../Context";

const NavAccountBtn = () => {
  const { user } = useContext(Context);

  function onClick() {
    // open login-registration modal window or link to the user cabinet page
  }

  return (
    <NavIconBtn 
      src={user.isAuth ? homeIcon : accBtnIcon}     
      alt="Account"
      className="acc-button"          
      isLink="true"           
      route={USER_ROUTE}      
      aria-label="Your account"         
      onClick={onClick} 
    />
  );
}

export default NavAccountBtn;
