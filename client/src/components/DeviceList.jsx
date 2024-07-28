import DeviceItem from "./DeviceItem";
import "./styles/DeviceList.css";
import DeviceComboActions from "../utils/DeviceComboActions";

const DeviceList = ({ devices, stocks, sales, saleTypeNames }) => {
  let className = "main-device-list";
  if (!devices.length) className += " display-none";

  return (
    <ul className={className}>
      {devices.map(dev => {
        const { 
          defaultCombinationInStock: defaultCombination,
          isInStock,
          isPreOrder
        } = DeviceComboActions.findDefaultCombination(dev, stocks); 
        
        return (
          <li key={`deviceItem: ${dev.id}`}>
            <DeviceItem 
              device={dev} 
              isInStock={isInStock} 
              isPreOrder={isPreOrder}
              defaultCombination={defaultCombination}
              stocks={stocks}
              sales={sales}
              saleTypeNames={saleTypeNames} 
            />
          </li>
        );
      }
      )}
    </ul>
  );
}

export default DeviceList;
