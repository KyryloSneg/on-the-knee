import { useContext } from "react";
import "./styles/SelectUserLocationModalBigCities.css";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import setSelectUserLocationVisibility from "../utils/setSelectUserLocationModalVisibility";

const SelectUserLocationModalBigCities = observer(({ bigCities }) => {
  const { app } = useContext(Context);

  function onClick(location) {
    localStorage.setItem("location", JSON.stringify(location));
    app.setUserLocation(location);
    setSelectUserLocationVisibility(false, app);
  }

  return (
    <ul className="select-user-location-modal-big-cities">
      {bigCities.map(city => {
        let className = "select-user-location-modal-big-city";
        if (app.userLocation?.id === city.id) {
          className += " selected";
        }

        return (
          <li key={city.id}>
            <button 
              className={className} 
              onClick={() => onClick(city)}
            >
              {city.name}
            </button>
          </li>
        );
      })}
    </ul>
  );
});

export default SelectUserLocationModalBigCities;
