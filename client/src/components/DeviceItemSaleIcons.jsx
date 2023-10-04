import StringActions from "../utils/StringActions";
import "./styles/DeviceItemSaleIcons.css";

const DeviceItemSaleIcons = ({ saleTypes, deviceId, ...props }) => {
  let className = "main-device-sale-icons";
  if (props.className) {
    className += ` ${props.className}`;
  }

  function renderIcons() {
    let icons = [];
    
    for (let index = 0; index < saleTypes.length; index++) {
      const type = saleTypes[index];
      if (type.logo) {
        let alt = StringActions.splitByUpperCaseLetters(type.name);
        alt = StringActions.capitalize(alt);

        icons.push(
          <li key={`${deviceId}: ${type.name} ${className}`}>
            <div className="device-sale-icon-wrap">
              <img src={type.logo} alt={alt} draggable="false" />
            </div>
          </li>
        );
      } else {
        icons.push(
          <li key={`${deviceId}: ${type.name} ${className}`}>
            <div className="device-sale-icon-wrap" style={{ backgroundColor: type.bgColor }}>
              {type.text}
            </div>
          </li>
        );
      }

    }

    return icons;
  }

  return (
    <ul className={className}>
      {renderIcons()}
    </ul>
  );
}

export default DeviceItemSaleIcons;
