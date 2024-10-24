import "./styles/DeviceList.css";
import DeviceItem from "./DeviceItem";
import DeviceComboActions from "../utils/DeviceComboActions";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../Context";

// each device must contain field "device-combinations"
// correspondingDefaultDeviceComboIdObj = {
//   "deviceId-index": defaultComboId
// }

// correspondingDefaultDeviceComboIdObj is used to show a certain combination
// areDevsWithCertainDevComboId is used to show a certain combination
// if (areDevsWithCertainDevComboId === true), each device must contain field "deviceCombinationId"

const DeviceList = observer(({ devices, areDevsWithCertainDevComboId = false, withHistoryDeletionBtn = false }) => {
  const { deviceStore } = useContext(Context);

  let className = "main-device-list";
  if (!devices?.length) className += " display-none";

  return (
    <ul className={className}>
      {devices?.map(dev => {
        let defaultCombination;
        let isInStock;
        let isPreOrder;

        if (areDevsWithCertainDevComboId) {
          defaultCombination = dev["device-combinations"].find(combo => combo.id === dev.deviceCombinationId);
          const result = DeviceComboActions.getStockInfo(defaultCombination, deviceStore.stocks);

          isInStock = result.isInStock;
          isPreOrder = result.isPreOrder
        } else {
          const result = DeviceComboActions.findDefaultCombination(dev, deviceStore.stocks); 

          defaultCombination = result.defaultCombinationInStock;
          isInStock = result.isInStock;
          isPreOrder = result.isPreOrder
        }
        
        return (
          <li key={`deviceItem: ${dev.id}`}>
            <DeviceItem 
              device={dev} 
              isInStock={isInStock} 
              isPreOrder={isPreOrder}
              defaultCombination={defaultCombination}
              withHistoryDeletionBtn={withHistoryDeletionBtn}
            />
          </li>
        );
      }
      )}
    </ul>
  );
});

export default DeviceList;
