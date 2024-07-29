import DeviceItemPrice from './DeviceItemPrice';
import DeviceSalesActions from '../utils/DeviceSalesActions';
import "./styles/DeviceSearchResultItem.css";
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../Context';

const DeviceSearchResultItem = observer(({ device, defaultCombo }) => {
  const { deviceStore } = useContext(Context);
  const { discountPercentage } = 
    DeviceSalesActions.getSaleTypesAndDiscount(device, deviceStore.sales, deviceStore.saleTypeNames) 
    || { discountPercentage: 0 };

  const image = defaultCombo.images[0];
  if (!deviceStore.sales?.length || !deviceStore.saleTypeNames?.length) return <div />;

  return (
    <section className="search-result-device">
      <div className="search-result-device-img-wrap">
        <img src={image.src} alt="" />
      </div>
      <div className="search-result-device-info">
        <p className="search-result-device-name">{device.name}</p>
        <DeviceItemPrice price={defaultCombo.price} discountPercentage={discountPercentage} />
      </div>
    </section>
  );
});

export default DeviceSearchResultItem;
