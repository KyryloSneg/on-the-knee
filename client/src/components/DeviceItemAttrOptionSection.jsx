import "./styles/DeviceItemAttrOptionSection.css";
import DeviceItemAttrOptions from "./DeviceItemAttrOptions";

const DeviceItemAttrOptionSection = ({ attributesList, deviceId, defaultCombo, isWithParagraph = false, isListbox = false, isDefaultDiv = false }) => {
  return (
    <ul className="device-item-attr-option-section">
      {attributesList.map(attrsObj => 
        <li key={`${deviceId}`}>
          <DeviceItemAttrOptions
            attributeName={attrsObj.name}
            valuesObjects={attrsObj.valuesObj}
            deviceId={deviceId} 
            defaultCombo={defaultCombo}
            isWithParagraph={isWithParagraph}
            isListbox={isListbox}
            isDefaultDiv={isDefaultDiv}
          />
        </li>
      )}
    </ul>
  );
}

export default DeviceItemAttrOptionSection;
