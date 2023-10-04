import { Link } from "react-router-dom";
import DeviceComboActions from "../utils/DeviceComboActions";
import "./styles/DeviceColorOptions.css";
import useCurrentPath from "../hooks/useCurrentPath";

const DeviceColorOptions = ({ hrefObjects }) => {
  const currentPath = useCurrentPath();
  return (
    <ul className="device-color-options">
      {hrefObjects.map(obj => {
        // :deviceId/:combinationString
        const combinationString = obj.href.split("/")[1];
        // color = spacedark#333334
        const color = DeviceComboActions.getColor(combinationString);
        const colorHEX = color.split("#")[1];

        // TODO test it later on the device page
        if (currentPath.startsWith("/catalog/:deviceId")) {
          obj.href = "../../" + obj.href;
        }

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
