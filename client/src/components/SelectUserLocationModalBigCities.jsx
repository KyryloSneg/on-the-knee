import { useContext } from "react";
import "./styles/SelectUserLocationModalBigCities.css";
import { Context } from "../Context";

const SelectUserLocationModalBigCities = ({ bigCities }) => {
  const { app } = useContext(Context);

  function onClick(location) {
    localStorage.setItem("location", JSON.stringify(location));
    app.setUserLocation(location);
  }

  return (
    <ul className="select-user-location-modal-big-cities">
      {bigCities.map(city => 
        <li key={city.id}>
          <button onClick={() => onClick(city)}>
            {city.name}
          </button>
        </li>
      )}
    </ul>
  );
}

export default SelectUserLocationModalBigCities;
