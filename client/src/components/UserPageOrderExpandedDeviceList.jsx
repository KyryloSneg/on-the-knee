import "./styles/UserPageOrderExpandedDeviceList.css";
import UserPageOrderExpandedDeviceListItem from "./UserPageOrderExpandedDeviceListItem";

const UserPageOrderExpandedDeviceList = ({ order, additionalServicesObjArray }) => {
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
}

export default UserPageOrderExpandedDeviceList;
