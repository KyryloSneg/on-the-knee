import "./styles/CheckoutPageDeliverySection.css";
import CheckoutPageDeliveryRadiogroup from "./CheckoutPageDeliveryRadiogroup";

const CheckoutPageDeliverySection = () => {
  return (
    <section className="checkout-page-delivery-section">
      <header>
        <h3>Delivery</h3>
      </header>
      <CheckoutPageDeliveryRadiogroup />
    </section>
  );
}

export default CheckoutPageDeliverySection;
