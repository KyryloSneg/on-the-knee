import { Link, useLocation } from "react-router-dom";
import DeviceComboActions from "../utils/DeviceComboActions";
import "./styles/DeviceColorOptions.css";
import { DEVICE_ROUTE } from "../utils/consts";
import useCurrentPath from "../hooks/useCurrentPath";

const DeviceColorOptions = ({ hrefObjects, deviceId, toShowSelectedOutline = false, isDefaultDiv = false }) => {
  const currentPath = useCurrentPath();
  const location = useLocation();

  let selectedCombinationString = null;
  if (toShowSelectedOutline && currentPath === DEVICE_ROUTE + ":deviceIdCombo") {
    const pathname = location.pathname.replaceAll("%20", " ");
    selectedCombinationString = pathname.split("--")[1];
  }

  const ulProps = toShowSelectedOutline
    ? { role: "listbox" }
    : {};

  return (
    <ul className="device-color-options" {...ulProps}>
      {hrefObjects.map(obj => {
        // it was made with old device routing:
        // :deviceIdCombo/:combinationString
        const combinationString = obj.href.split(`${DEVICE_ROUTE}${deviceId}--`)[1];
        // color = color:spacedark_333334
        const color = DeviceComboActions.getColor(combinationString);
        const colorHEX = color.split("_")[1];

        let className = "color-option";
        if (obj.isDisabled) {
          className += " disabled-color-option";
        }

        let isSelected = false;
        if (toShowSelectedOutline) {
          if (selectedCombinationString) {
            isSelected = selectedCombinationString === combinationString;
          }
          // we can implement here the logic for other pages than device one
        }

        if (isSelected) {
          className += " selected-color-option";
        }

        const ariaLabel = `Select ${color.split("_")[0].split(":")[1]} color`;
        const liProps = ulProps.role
          ? { role: "option", "aria-selected": isSelected }
          : {};

        return (
          <li key={`color-option: ${obj.href}`} {...liProps}>
            {isSelected && isDefaultDiv
              ? <div className={className} style={{ backgroundColor: `#${colorHEX}` }} />
              : (
                <Link
                  to={obj.href}
                  className={className}
                  aria-label={ariaLabel}
                  style={{ backgroundColor: `#${colorHEX}` }}
                />
              )
            }

          </li>
        );
      })}
    </ul>
  );
}

export default DeviceColorOptions;
