import { Context } from "Context";
import { observer } from "mobx-react-lite";
import { useContext, useRef } from "react";
import MenuIconBtn from "./UI/menuIconBtn/MenuIconBtn";
import { USER_VIEWED_DEVICES_ROUTE } from "utils/consts";
import onAuthBtnClick from "utils/onAuthBtnClick";
import viewedDevicesBtnIcon from "../assets/visibility_24x24_black.svg";

const MenuViewedDevicesBtn = observer(() => {
  const { app, user } = useContext(Context);
  const btnRef = useRef(null);

  return (
    <MenuIconBtn
      children="Viewed devices"
      src={viewedDevicesBtnIcon}
      isLink={user.isAuth}
      route={USER_VIEWED_DEVICES_ROUTE}
      onClick={() => onAuthBtnClick(user.isAuth, app, btnRef)}
      className="menu-account-btn"
      ref={btnRef}
    />
  );
});

export default MenuViewedDevicesBtn;
