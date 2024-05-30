import { useContext } from "react";
import "./styles/UserLocationBtnNotification.css";
import { Context } from "../Context";
import UserLocationBtn from "./UserLocationBtn";
import UserLocationNotification from "./UserLocationNotification";
import { observer } from "mobx-react-lite";

const UserLocationBtnNotification = observer(({ additionalText = "" }) => {
  const { app } = useContext(Context);

  return (
    <div className="user-location-btn-notification">
      <UserLocationBtn additionalText={additionalText} />
      {app.isToShowUserLocationNotification && <UserLocationNotification />}
    </div>
  );
});

export default UserLocationBtnNotification;
