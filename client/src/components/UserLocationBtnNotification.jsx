import "./styles/UserLocationBtnNotification.css";
import { useContext, useRef } from "react";
import { Context } from "../Context";
import UserLocationBtn from "./UserLocationBtn";
import UserLocationNotification from "./UserLocationNotification";
import { observer } from "mobx-react-lite";

const UserLocationBtnNotification = observer(({ 
  additionalText = "", className = "", userLocationBtnClassName = "", ...props 
}) => {
  const { app } = useContext(Context);
  const userLocationBtnRef = useRef(null);

  let divClassName = "user-location-btn-notification";
  if (className) {
    divClassName += ` ${className}`;
  }

  return (
    <div className={divClassName}>
      <UserLocationBtn additionalText={additionalText} className={userLocationBtnClassName} ref={userLocationBtnRef} />
      {app.isToShowUserLocationNotification && 
        <UserLocationNotification userLocationBtnRef={userLocationBtnRef} />
      }
    </div>
  );
});

export default UserLocationBtnNotification;
