import DeviceItemAddToCartBtn from "./DeviceItemAddToCartBtn";
import DeviceItemPrice from "./DeviceItemPrice";
import "./styles/DevicePurchaseSection.css";

const DevicePurchaseSection = ({ price, discountPercentage, device }) => {
  return (
    <section className="device-purchase-section">
      <DeviceItemPrice price={price} discountPercentage={discountPercentage} />
      <DeviceItemAddToCartBtn isWithText={true} isPreOrder={device.isPreOrder} />
    </section>
  );
}

export default DevicePurchaseSection;
