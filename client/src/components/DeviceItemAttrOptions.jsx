import { Link } from "react-router-dom";
import "./styles/DeviceItemAttrOptions.css";

const DeviceItemAttrOptions = ({ attributeName, valuesObjects, deviceId, defaultCombo }) => {

  // attributesList:
  // [
  //   {
  //     name: "hz",
  //     valuesObj: [
  //       {
  //         attrValue: "...",
  //         href: "..."
  //         disabled: false
  //       },
  //       {
  //         attrValue: "...",
  //         href: "...",
  //         disabled: true
  //       }
  //     ]
  //   },
  // ]

  return (
    <ul className="attr-options">
      {valuesObjects.map(obj => {
        // if attrs that aren't in stock or do not exist in combo with other default combination's attrs
        // render "disabled" option

        let className = "";
        if (obj.isDisabled) {
          className = "disabled-attr-option";
        } else {
          for (let attr of defaultCombo.combinationString.split("-")) {
            if (`${attributeName}:${obj.attrValue}` === attr) {
              className = "default-option";
              break;
            }
          }
        }

        return (
          <li key={`${deviceId}-${attributeName}: ${obj.href} ${obj.attrValue}`}>
            <Link to={obj.href} className={className}>
              {obj.attrValue}
            </Link>
          </li>
        )
      })}
    </ul>
  );
}

export default DeviceItemAttrOptions;
