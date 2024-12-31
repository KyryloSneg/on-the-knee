import { Context } from "Context";
import { observer } from "mobx-react-lite";
import { useContext, useRef } from "react";
import MenuIconBtn from "./UI/menuIconBtn/MenuIconBtn";
import { USER_FEEDBACKS_ROUTE } from "../utils/consts";
import onAuthBtnClick from "../utils/onAuthBtnClick";
import feedbacksBtnIcon from "../assets/comment_24x24_black.svg";

const MenuFeedbacksBtn = observer(() => {
  const { app, user } = useContext(Context);
  const btnRef = useRef(null);

  return (
    <MenuIconBtn
      children="Your feedbacks"
      src={feedbacksBtnIcon}
      isLink={user.isAuth}
      route={USER_FEEDBACKS_ROUTE}
      onClick={() => onAuthBtnClick(user.isAuth, app, btnRef)}
      className="menu-account-btn"
      ref={btnRef}
    />
  );
});

export default MenuFeedbacksBtn;
