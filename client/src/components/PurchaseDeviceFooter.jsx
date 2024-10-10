import "./styles/PurchaseDeviceFooter.css";
import { useContext } from "react";
import DeviceSalesActions from "../utils/DeviceSalesActions";
import DeviceItemPrice from "./DeviceItemPrice";
import AddToDesiredListBtn from "./AddToDesiredListBtn";
import DeviceItemAddToCartBtn from "./DeviceItemAddToCartBtn";
import { observer } from "mobx-react-lite";
import { Context } from "../Context";

const PurchaseDeviceFooter = observer(({ device, selectedCombo, selectedAddServices }) => {
  const { deviceStore } = useContext(Context); 
  if (!deviceStore.hasTriedToFetchSales) return <div />;

  const image = selectedCombo.images[0];
  const { discountPercentage } =
    DeviceSalesActions.getSaleTypesAndDiscount(
      device, deviceStore.sales, deviceStore.saleTypeNames, deviceStore.hasTriedToFetchSales
    ) || { discountPercentage: 0 };

  return (
    <section className="purchase-device-footer">
      <img src={image.src} alt="" draggable="false" />
      <p className="purchase-device-footer-device-name">
        {device.name} ({selectedCombo.sku})
      </p>
      <DeviceItemPrice price={selectedCombo.price} discountPercentage={discountPercentage} />
      <AddToDesiredListBtn />
      <DeviceItemAddToCartBtn 
        combinations={device["device-combinations"]} 
        combo={selectedCombo} 
        selectedAddServices={selectedAddServices} 
      />
    </section>
  );
});

export default PurchaseDeviceFooter;
