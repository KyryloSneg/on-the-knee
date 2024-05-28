import { useContext } from "react";
import { Context } from "../Context";
import "./styles/SelectUserLocationModalListItem.css";
import { observer } from "mobx-react-lite";
import setSelectUserLocationVisibility from "../utils/setSelectUserLocationModalVisibility";

const SelectUserLocationModalListItem = observer(({ city }) => {
  const { app } = useContext(Context);

  let className = "select-user-location-modal-list-item";
  if (app.userLocation.id === city.id) {
    className += " selected";
  }

  function onClick(location) {
    localStorage.setItem("location", JSON.stringify(location));
    app.setUserLocation(location);
    setSelectUserLocationVisibility(false, app);
  }

  return (
    <button 
      className={className}
      onClick={() => onClick(city)}
    >
      {city.fullName}
    </button>
  );
});

export default SelectUserLocationModalListItem;
