import "./styles/UserLocationBtn.css";
import { forwardRef, useContext, useEffect, useRef } from "react";
import setSelectUserLocationVisibility from "../utils/setSelectUserLocationModalVisibility";
import { Context } from "../Context";
import geoIcon from "../assets/location_24x24_434343.svg";
import { observer } from "mobx-react-lite";

const UserLocationBtn = observer(forwardRef(({ additionalText = "", className = "" }, ref) => {
  const { app } = useContext(Context);
  const fallbackBtnRef = useRef(null);

  // if we haven't passed the ref, use fallback one
  // (it's most of the possible cases)
  const refToUse = ref || fallbackBtnRef;

  let btnClassName = "user-location-btn";
  if (className) {
    btnClassName += ` ${className}`;
  }

  function onClick() {
    // we can have more than one user location btn, so set it on click,
    // not in a useEffect hook
    setSelectUserLocationVisibility(true, app, refToUse);
  }

  useEffect(() => {
    app.setUserLocationBtnRef(refToUse);
  }, [app, refToUse]);

  return (
    <button className={btnClassName} onClick={onClick} ref={refToUse}>
      <img src={geoIcon} alt="" draggable="false" />
      {additionalText
        ? <span>
            {additionalText} <strong>{app.userLocation?.name || "..."}</strong>
          </span>
        : app.userLocation?.name || "..."
      }
    </button>
  );
}));

export default UserLocationBtn;
