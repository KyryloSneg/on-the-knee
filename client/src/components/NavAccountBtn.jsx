import accBtnIcon from "../assets/acc-button.svg";
import homeIcon from "../assets/home.svg";
import NavIconBtn from "./UI/navIconBtn/NavIconBtn";
import "./styles/NavAccountBtn.css";
import { USER_ORDERS_ROUTE } from "../utils/consts";
import { useContext, useRef } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import onAccountBtnClick from "../utils/onAccountBtnClick";

const NavAccountBtn = observer(() => {
  const { user, app } = useContext(Context);
  const btnRef = useRef(null);

  return (
    <NavIconBtn 
      src={user.isAuth ? homeIcon : accBtnIcon}     
      alt="Account"
      className="acc-button"          
      isLink={user.isAuth}         
      route={USER_ORDERS_ROUTE}      
      aria-label="Your account"         
      onClick={() => onAccountBtnClick(user.isAuth, app, btnRef)} 
      ref={btnRef}
    />
  );
});

export default NavAccountBtn;
