import DeviceItemAttrOptionSection from "./DeviceItemAttrOptionSection";
import DeviceItemSaleIcons from "./DeviceItemSaleIcons";
import "./styles/DeviceItemHiddenContent.css";

const DeviceItemHiddenContent = ({ logoSaleTypes, deviceId, attributesList, defaultCombo }) => {
  return (
    <div className="main-device-hidden-content">
      <DeviceItemSaleIcons
        saleTypes={logoSaleTypes} 
        deviceId={deviceId} 
      />
      {!!attributesList.length && 
        <DeviceItemAttrOptionSection 
          attributesList={attributesList} 
          deviceId={deviceId} 
          defaultCombo={defaultCombo}
        />
      }
      {/* device info */}
    </div>
  );
}

export default DeviceItemHiddenContent;
