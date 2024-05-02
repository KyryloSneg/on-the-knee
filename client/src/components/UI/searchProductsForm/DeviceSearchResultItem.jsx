import React from 'react';
import DeviceItemPrice from '../../DeviceItemPrice';
import DeviceSalesActions from '../../../utils/DeviceSalesActions';
import "./DeviceSearchResultItem.css";

const DeviceSearchResultItem = ({ device, defaultCombo, sales, saleTypeNames }) => {
  const { discountPercentage } = 
    DeviceSalesActions.getSaleTypesAndDiscount(device, sales, saleTypeNames) 
    || { discountPercentage: 0 };

  const image = defaultCombo.images[0];

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
}

export default DeviceSearchResultItem;
