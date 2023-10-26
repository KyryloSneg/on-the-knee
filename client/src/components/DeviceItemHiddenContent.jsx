import { DEVICE_ITEM_INFO_AMOUNT_LIMIT } from "../utils/consts";
import DeviceItemAttrOptionSection from "./DeviceItemAttrOptionSection";
import DeviceItemInfo from "./DeviceItemInfo";
import DeviceItemSaleIcons from "./DeviceItemSaleIcons";
import "./styles/DeviceItemHiddenContent.css";

const DeviceItemHiddenContent = ({ logoSaleTypes, deviceId, attributesList, defaultCombo, deviceInfos }) => {
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
      <DeviceItemInfo 
        deviceInfos={deviceInfos.slice(0, DEVICE_ITEM_INFO_AMOUNT_LIMIT)} 
        deviceId={deviceId} 
      />
    </div>
  );
}

export default DeviceItemHiddenContent;
