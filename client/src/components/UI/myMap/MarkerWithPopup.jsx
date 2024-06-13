import "./MarkerWithPopup.css";
import { useState } from "react";
import { Marker, Popup } from "react-map-gl";
import myMarkerPinIcon from "../../../assets/my-marker-pin.png";

const MarkerWithPopup = ({ 
  markerId, lng, lat, popupChildren, 
  flyTo = null, selectedMarkerId = null,
  setSelectedMarkerId = null, ...props 
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(true);

  function onMarkerClick() {
    const nextIsPopupVisible = !isPopupVisible;
    setIsPopupVisible(nextIsPopupVisible);

    if (setSelectedMarkerId) setSelectedMarkerId(markerId);
    if (flyTo) flyTo({ center: [lng, lat], zoom: 15 });
  }

  const areIdsAssigned = markerId !== null && selectedMarkerId !== null;
  const isSelected = markerId === selectedMarkerId;
  
  if (areIdsAssigned && !isSelected && !isPopupVisible) {
    setIsPopupVisible(true);
  }

  return (
    <div className="marker-with-popup" {...props}>
      {(isSelected && isPopupVisible) &&
        <Popup
          anchor="bottom"
          longitude={lng}
          latitude={lat}
          offset={30}
          onClose={() => setIsPopupVisible(false)}
          closeOnMove={false}
          closeOnClick={false}
          className="my-popup"
        >
          {popupChildren}
        </Popup>
      }
      <Marker
        longitude={lng}
        latitude={lat}
        onClick={onMarkerClick}
      >
        <img src={myMarkerPinIcon} alt="" draggable="false" />
      </Marker>
    </div>
  );
}

export default MarkerWithPopup;
