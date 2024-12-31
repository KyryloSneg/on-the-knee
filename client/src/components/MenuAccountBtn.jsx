import "./styles/MenuAccountBtn.css";
import MenuIconBtn from "./UI/menuIconBtn/MenuIconBtn";
import accBtnIcon from "../assets/acc-button-black.svg";
import { useContext, useRef } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import { USER_PERSONAL_DATA_ROUTE } from "../utils/consts";
import onAuthBtnClick from "../utils/onAuthBtnClick";

const MenuAccountBtn = observer(() => {
  const { user, app } = useContext(Context);
  const btnRef = useRef(null);

  return (
    <MenuIconBtn
      children={
        user.isAuth
          ? (
            <div className="menu-account-btn-content-wrap">
              <p className="menu-acc-btn-username">
                {user.user?.name || ""} {user.user?.surname || ""}
              </p>
              <p className="menu-acc-btn-user-email">
                {user.userAddress?.email || ""}
              </p>
            </div>
          )
          : "Log in"
      }
      src={accBtnIcon}
      isLink={user.isAuth}
      route={USER_PERSONAL_DATA_ROUTE}
      aria-label="Your account"
      aria-controls="authentification-modal"
      onClick={() => onAuthBtnClick(user.isAuth, app, btnRef)}
      className="menu-account-btn"
      ref={btnRef}
    />
  );
});

export default MenuAccountBtn;
