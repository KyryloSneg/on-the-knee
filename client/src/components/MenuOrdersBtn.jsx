import { USER_ORDERS_ROUTE } from "utils/consts";
import MenuIconBtn from "./UI/menuIconBtn/MenuIconBtn";
import { useContext, useRef } from "react";
import { Context } from "Context";
import { observer } from "mobx-react-lite";
import ordersBtnIcon from "../assets/orders_24x24_black.svg";
import onAuthBtnClick from "../utils/onAuthBtnClick";

const MenuOrdersBtn = observer(() => {
  const { app, user } = useContext(Context);
  const btnRef = useRef(null);

  return (
    <MenuIconBtn
      children="My orders"
      src={ordersBtnIcon}
      isLink={user.isAuth}
      route={USER_ORDERS_ROUTE}
      onClick={() => onAuthBtnClick(user.isAuth, app, btnRef)}
      className="menu-account-btn"
      ref={btnRef}
    />
  );
});

export default MenuOrdersBtn;
