import "./styles/SelectUserLocationModalList.css";
import SelectUserLocationModalListItem from "./SelectUserLocationModalListItem";
 
const SelectUserLocationModalList = ({ cities }) => {
  return (
    <ul className="select-user-location-modal-list" key="select-user-location-modal-list">
      {cities.map(city =>
        <li key={city.id}>
          <SelectUserLocationModalListItem city={city} />
        </li>
      )}
    </ul>
  );
}

export default SelectUserLocationModalList;
