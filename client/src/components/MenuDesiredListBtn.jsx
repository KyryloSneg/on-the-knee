import { useContext, useRef } from 'react';
import MenuIconBtn from "./UI/menuIconBtn/MenuIconBtn";
import { Context } from "Context";
import { observer } from "mobx-react-lite";
import onAuthBtnClick from "../utils/onAuthBtnClick";
import { USER_DESIRED_LIST_ROUTE } from "utils/consts";
import desiredListBtnIcon from "../assets/favorite_24x24_black.svg";

const MenuDesiredListBtn = observer(() => {
  const { app, user } = useContext(Context);
  const btnRef = useRef(null);

  return (
    <MenuIconBtn
      children="Desired list"
      src={desiredListBtnIcon}
      isLink={user.isAuth}
      route={USER_DESIRED_LIST_ROUTE}
      onClick={() => onAuthBtnClick(user.isAuth, app, btnRef)}
      className="menu-account-btn"
      ref={btnRef}
    />
  );
});

export default MenuDesiredListBtn;
