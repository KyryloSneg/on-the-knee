import "./styles/UserLocationNotification.css";
import { useContext } from 'react';
import geoIcon from "../assets/location_40x40_7373ff.svg";
import { Context } from '../Context';
import { observer } from 'mobx-react-lite';
import setSelectUserLocationVisibility from "../utils/setSelectUserLocationModalVisibility";

const UserLocationNotification = observer(({ userLocationBtnRef }) => {
  const { app } = useContext(Context);

  function acceptLocation() {
    app.setIsToShowUserLocationNotification(false);
  }

  function changeLocation() {
    console.log(userLocationBtnRef);
    setSelectUserLocationVisibility(true, app, userLocationBtnRef);
    app.setIsToShowUserLocationNotification(false);
  }

  if (!app.isUserLocationDeterminedCorrectly) {
    return (
      <section className="user-location-notification">
        <div className="user-location-notification-triangle" />
        <p>
          <img src={geoIcon} alt="" draggable="false" />
          Unfortunately, we haven't found your location
        </p>
        <button className="change-location-btn" onClick={changeLocation}>
          Select it
        </button>
      </section>
    );
  }

  return (
    <section className="user-location-notification">
      <div className="user-location-notification-triangle" />
      <p>
        <img src={geoIcon} alt="" draggable="false" />
        Is your location <strong>{app.userLocation?.name || "..."}</strong>?
      </p>
      <div className="btn-group">
        <button className="correct-button" onClick={acceptLocation}>
          Yes, it's correct
        </button>
        <button className="change-location-btn" onClick={changeLocation}>
          No, change it
        </button>
      </div>
    </section>
  );
});

export default UserLocationNotification;
