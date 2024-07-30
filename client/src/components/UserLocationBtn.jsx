import "./styles/UserLocationBtn.css";
import { useContext, useRef } from "react";
import setSelectUserLocationVisibility from "../utils/setSelectUserLocationModalVisibility";
import { Context } from "../Context";
import geoIcon from "../assets/location_24x24_434343.svg";
import { observer } from "mobx-react-lite";

const UserLocationBtn = observer(({ additionalText = "", className = "" }) => {
  const { app } = useContext(Context);
  const btnRef = useRef(null);

  let btnClassName = "user-location-btn";
  if (className) {
    btnClassName += ` ${className}`;
  }

  function onClick() {
    // we can have more than one user location btn, so set it on click,
    // not in a useEffect hook
    app.setUserLocationBtnRef(btnRef);
    setSelectUserLocationVisibility(true, app);
  }

  return (
    <button className={btnClassName} onClick={onClick} ref={btnRef}>
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
