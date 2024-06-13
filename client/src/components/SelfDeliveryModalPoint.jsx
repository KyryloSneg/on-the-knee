import "./styles/SelfDeliveryModalPoint.css";
import locationIcon from "../assets/location_24x24_434343.svg";
import scheduleIcon from "../assets/schedule_24x24_434343.svg";
import phoneIcon from "../assets/call_24x24_434343.svg";

const SelfDeliveryModalPoint = ({ 
  point, selectedId = null, setSelectedId = null, 
  changeMapCoords = null, isTelLink = false, className = "" 
}) => {
  const isSelected = point.id === selectedId;

  let btnClassName = "self-delivery-modal-point"
  if (isSelected) {
    btnClassName += " selected";
  }

  if (className) {
    btnClassName += ` ${className}`;
  }

  const startDate = new Date(point.startTime);
  const endDate = new Date(point.endTime);

  let startDateStr = startDate.toLocaleTimeString();
  let endDateStr = endDate.toLocaleTimeString();

  // we are not interested in seconds here
  startDateStr = startDateStr.split(":").slice(0, 2).join(":");
  endDateStr = endDateStr.split(":").slice(0, 2).join(":");

  function onClick() {
    if (!isSelected) {
      if (setSelectedId) setSelectedId(point.id)
      if (changeMapCoords) changeMapCoords(point.lng, point.lat);
    };
  }

  return (
    <button className={btnClassName} onClick={onClick}>
      <div>
        <img src={locationIcon} alt="" draggable="false" />
        <span className="self-delivery-modal-point-fullname">
          {point.fullName}
        </span>
      </div>
      <div>
        <img src={scheduleIcon} alt="" draggable="false" />
        <span>{startDateStr} - {endDateStr}</span>
        <span className="visually-hidden">
          Work time: from {startDateStr} to {endDateStr}
        </span>
      </div>
      <div>
        <img src={phoneIcon} alt="" draggable="false" />
        {isTelLink
          ? <a href={`tel:${point.phoneNumber.replaceAll(" ", "")}`} className="link-colors">{point.phoneNumber}</a>
          : <span>{point.phoneNumber}</span>
        }
      </div>
    </button>
  );
}

export default SelfDeliveryModalPoint;
