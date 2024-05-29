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
      {/* <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343">
        <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
      </svg> */}
      {additionalText
        ? <span>
          {additionalText} <strong>{app.userLocation?.name || ""}</strong>
        </span>
        : app.userLocation?.name || ""
      }
    </button>
  );
});

export default UserLocationBtn;
