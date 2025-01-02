import "./styles/DeviceRightDescDeliveryList.css";
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../Context';
import DeviceRightDescDeliveryListItem from "./DeviceRightDescDeliveryListItem";

const DeviceRightDescDeliveryList = observer(({ deviceSaleTypes }) => {
  const { app } = useContext(Context)
  if (!app.deliveries?.length) return;

  return (
    <ul className="device-right-desc-delivery-list">
      {app.deliveries?.map(delivery => 
        <li key={delivery.id}>
          <DeviceRightDescDeliveryListItem delivery={delivery} deviceSaleTypes={deviceSaleTypes} />
        </li>
      )}
    </ul>
  );
});

export default DeviceRightDescDeliveryList;
