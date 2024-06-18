import "./styles/PurchaseDeviceFooter.css";
import { useState } from "react";
import useGettingDeviceRelatedData from "../hooks/useGettingDeviceRelatedData";
import DeviceSalesActions from "../utils/DeviceSalesActions";
import DeviceItemPrice from "./DeviceItemPrice";
import AddToDesiredListBtn from "./AddToDesiredListBtn";
import DeviceItemAddToCartBtn from "./DeviceItemAddToCartBtn";

const PurchaseDeviceFooter = ({ device, selectedCombo }) => {
  const [sales, setSales] = useState([]);
  const [saleTypeNames, setSaleTypeNames] = useState([]);

  const image = selectedCombo.images[0];
  const { discountPercentage } =
    DeviceSalesActions.getSaleTypesAndDiscount(device, sales, saleTypeNames)
    || { discountPercentage: 0 };

  useGettingDeviceRelatedData(setSales, setSaleTypeNames, () => null);

  return (
    <section className="purchase-device-footer">
      <img src={image.src} alt="" draggable="false" />
      <p className="purchase-device-footer-device-name">
        {device.name} ({selectedCombo.sku})
      </p>
      <DeviceItemPrice price={selectedCombo.price} discountPercentage={discountPercentage} />
      <AddToDesiredListBtn />
      <DeviceItemAddToCartBtn />
    </section>
  );
}

export default PurchaseDeviceFooter;
