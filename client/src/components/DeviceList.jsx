import { useContext } from "react";
import { Context } from "../Context";
import DeviceItem from "./DeviceItem";
import "./styles/DeviceList.css";
import DeviceComboActions from "../utils/DeviceComboActions";

const DeviceList = () => {
  const { deviceStore } = useContext(Context);
  return (
    <ul className="main-device-list">
      {deviceStore.devices.map(dev => {
        const { 
          defaultCombinationInStock: defaultCombination,
          isInStock
        } = DeviceComboActions.findDefaultCombination(dev, deviceStore.stocks); 
        
        return (
          <li key={`deviceItem: ${dev.id}`}>
            <DeviceItem 
              device={dev} 
              isInStock={isInStock} 
              defaultCombination={defaultCombination} 
            />
          </li>
        );
      }
      )}
    </ul>
  );
}

export default DeviceList;
