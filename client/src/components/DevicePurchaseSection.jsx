import DeviceItemAddToCartBtn from "./DeviceItemAddToCartBtn";
import DeviceItemPrice from "./DeviceItemPrice";
import "./styles/DevicePurchaseSection.css";

const DevicePurchaseSection = ({ price, discountPercentage }) => {
  return (
    <section className="device-purchase-section">
      <DeviceItemPrice price={price} discountPercentage={discountPercentage} />
      <DeviceItemAddToCartBtn isWithText={true} />
    </section>
  );
}

export default DevicePurchaseSection;
