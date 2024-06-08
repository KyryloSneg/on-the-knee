import "./styles/UserLocationBtn.css";
import { useContext } from "react";
import setSelectUserLocationVisibility from "../utils/setSelectUserLocationModalVisibility";
import { Context } from "../Context";
import geoIcon from "../assets/location_24x24_434343.svg";
import { observer } from "mobx-react-lite";

const UserLocationBtn = observer(({ additionalText = "", className = "" }) => {
  const { app } = useContext(Context);
  let btnClassName = "user-location-btn";
  if (className) {
    btnClassName += ` ${className}`;
  }

  function onClick() {
    setSelectUserLocationVisibility(true, app);
  }

  return (
    <button className={btnClassName} onClick={onClick}>
      <img src={geoIcon} alt="" draggable="false" />
      {additionalText
        ? <span>
            {additionalText} <strong>{app.userLocation?.name || "..."}</strong>
          </span>
        : app.userLocation?.name || "..."
      }
    </button>
  );
});

export default UserLocationBtn;
