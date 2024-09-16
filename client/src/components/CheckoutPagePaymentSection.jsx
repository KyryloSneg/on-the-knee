import "./styles/CheckoutPagePaymentSection.css";
import paymentIcon from "../assets/payments_24x24_434343.svg";

const CheckoutPagePaymentSection = () => {
  return (
    <section className="checkout-page-payment-section">
      <header>
        <h3>
          Payment
        </h3>
      </header>
      {
       /* 
        * i won't implement "Pay immediately" option because i don't want to sign 
        * a contract with payment services (it's just a learning project) 
        */
      }
      <div className="checkout-page-section-btn">
        <img src={paymentIcon} alt="" draggable="false" />
        <p>
          Payment on receipt
        </p>
      </div>
    </section>
  );
}

export default CheckoutPagePaymentSection;
