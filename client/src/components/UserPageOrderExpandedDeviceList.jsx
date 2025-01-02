import "./styles/UserPageOrderExpandedDeviceList.css";
import { useContext } from "react";
import UserPageOrderExpandedDeviceListItem from "./UserPageOrderExpandedDeviceListItem";
import { Context } from "Context";
import { observer } from "mobx-react-lite";

const UserPageOrderExpandedDeviceList = observer(({ order, additionalServicesObjArray }) => {
  const { deviceStore } = useContext(Context);
  if (!deviceStore.hasTriedToFetchSales) return;

  const orderSelectedAdditionalServices = order?.["order-selected-additional-services"];

  return (
    <ul className="user-page-order-expanded-device-list">
      {order["order-device-combinations"]?.map((combo, index) => 
        <li key={combo.id}>
          <UserPageOrderExpandedDeviceListItem 
            orderCombo={combo} 
            orderSelectedAdditionalServices={orderSelectedAdditionalServices} 
            additionalServicesObj={additionalServicesObjArray[index]}
          />
        </li>
      )}
    </ul>
  );
});

export default UserPageOrderExpandedDeviceList;
