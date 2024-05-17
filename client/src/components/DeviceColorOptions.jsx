import { Link } from "react-router-dom";
import DeviceComboActions from "../utils/DeviceComboActions";
import "./styles/DeviceColorOptions.css";
import { DEVICE_ROUTE } from "../utils/consts";

const DeviceColorOptions = ({ hrefObjects, deviceId }) => {
  return (
    <ul className="device-color-options">
      {hrefObjects.map(obj => {
        // it was made with old device routing:
        // :deviceIdCombo/:combinationString
        const combinationString = obj.href.split(`${DEVICE_ROUTE}${deviceId}--`)[1];
        // color = spacedark#333334
        const color = DeviceComboActions.getColor(combinationString);
        const colorHEX = color.split("_")[1];

        let className = "";
        if (obj.isDisabled) {
          className = "disabled-color-option";
        }

        return (
          <li key={`color-option: ${obj.href}`} className={className}>
            <Link to={obj.href} style={{backgroundColor: `#${colorHEX}`}} />
          </li>
        );
      })}
    </ul>
  );
}

export default DeviceColorOptions;
