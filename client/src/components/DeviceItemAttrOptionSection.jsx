import DeviceItemAttrOptions from "./DeviceItemAttrOptions";

const DeviceItemAttrOptionSection = ({ attributesList, deviceId, defaultCombo }) => {
  return (
    <ul>
      {attributesList.map(attrsObj => 
        <li key={`${deviceId}`}>
          <DeviceItemAttrOptions
            attributeName={attrsObj.name}
            valuesObjects={attrsObj.valuesObj}
            deviceId={deviceId} 
            defaultCombo={defaultCombo}
          />
        </li>
      )}
    </ul>
  );
}

export default DeviceItemAttrOptionSection;
