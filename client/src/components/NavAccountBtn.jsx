import accBtnIcon from "../assets/acc-button.svg";
import homeIcon from "../assets/home.svg";
import NavIconBtn from "./UI/navIconBtn/NavIconBtn";
import "./styles/NavAccountBtn.css";
import { USER_ROUTE } from "../utils/consts";
import { useContext, useRef } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import setAuthentificationModalVisibility from "../utils/setAuthentificationModalVisibility";

const NavAccountBtn = observer(() => {
  const { user, app } = useContext(Context);
  const btnRef = useRef(null);

  function onClick() {
    if (!user.isAuth) {
      setAuthentificationModalVisibility(true, app);
      app.setAuthentificationModalBtnRef(btnRef);
    }
  }

  return (
    <NavIconBtn 
      src={user.isAuth ? homeIcon : accBtnIcon}     
      alt="Account"
      className="acc-button"          
      isLink={user.isAuth}         
      route={USER_ROUTE}      
      aria-label="Your account"         
      onClick={onClick} 
      ref={btnRef}
    />
  );
});

export default NavAccountBtn;
