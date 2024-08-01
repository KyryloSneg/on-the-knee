import { useContext, useRef } from "react";
import "./styles/UserLocationBtnNotification.css";
import { Context } from "../Context";
import UserLocationBtn from "./UserLocationBtn";
import UserLocationNotification from "./UserLocationNotification";
import { observer } from "mobx-react-lite";

const UserLocationBtnNotification = observer(({ additionalText = "" }) => {
  const { app } = useContext(Context);
  const userLocationBtnRef = useRef(null);

  return (
    <div className="user-location-btn-notification">
      <UserLocationBtn additionalText={additionalText} ref={userLocationBtnRef} />
      {app.isToShowUserLocationNotification && 
        <UserLocationNotification userLocationBtnRef={userLocationBtnRef} />
      }
    </div>
  );
});

export default UserLocationBtnNotification;
