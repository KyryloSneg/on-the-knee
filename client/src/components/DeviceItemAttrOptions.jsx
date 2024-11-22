import { Link } from "react-router-dom";
import "./styles/DeviceItemAttrOptions.css";
import StringActions from "../utils/StringActions";

const DeviceItemAttrOptions = ({ attributeName, valuesObjects, deviceId, defaultCombo, isWithParagraph, isListbox, isDefaultDiv }) => {

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

  // default option is the selected one on the device page
  let defaultOption = { name: attributeName, value: null };
  for (let obj of valuesObjects) {

    for (let attr of defaultCombo.combinationString.split("-")) {
      if (`${attributeName}:${obj.attrValue}` === attr) {
        defaultOption = { name: attributeName, value: obj.attrValue }
        break;
      }
    }

  }

  const nameToRender = StringActions.capitalize(
    StringActions.splitByUpperCaseLetters(attributeName)
  );

  const ulProps = isListbox
    ? { role: "listbox" }
    : {};

  return (
    <div className="attr-options-wrap">
      {isWithParagraph && <p>{nameToRender}</p>}
      <ul className="attr-options">
        {valuesObjects.map(obj => {
          // if attrs that aren't in stock or do not exist in combo with other default combination's attrs
          // render "disabled" option

          let className = "attr-option";
          if (obj.isDisabled) {
            className += " disabled-attr-option";
          }

          const isSelected = defaultOption.value === obj.attrValue;
          if (isSelected) className += " default-option";

          const ariaLabel = `Select ${defaultOption.value} ${nameToRender}`;
          const liProps = ulProps.role
            ? { role: "option", "aria-selected": isSelected }
            : {};

          return (
            <li key={`${deviceId}-${attributeName}: ${obj.href} ${obj.attrValue}`} {...liProps}>
              {/* we don't have a reason to show selected on the device page attr as a Link component */}
              {/* TODO: SCROLL */}
              {isSelected && isDefaultDiv
                ? (
                  <div className={className}>
                    {obj.attrValue}
                  </div>
                )
                : (
                  <Link to={obj.href} aria-label={ariaLabel} className={className}>
                    {obj.attrValue}
                  </Link>
                )
              }
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export default DeviceItemAttrOptions;
