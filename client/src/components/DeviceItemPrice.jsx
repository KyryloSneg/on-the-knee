import "./styles/DeviceItemPrice.css";

const DeviceItemPrice = ({ price, discountPercentage = 0 }) => {
  if (discountPercentage > 0) {
    let discountedPrice = price * ( (100 - discountPercentage) / 100 );
    discountedPrice = discountedPrice.toFixed(2);

    return (
      <div className="main-device-price-wrap display-flex">
        <p className="main-device-old-price">
          <span>{price}</span>
          <span className="main-device-currency">$</span>
        </p>
        <p className="main-device-price">
          <b>{discountedPrice}</b>
          <span className="main-device-currency">$</span>
        </p>
      </div>
    );
  }

  return (
    <p className="main-device-price">
      <b>{price}</b>
      <span className="main-device-currency">$</span>
    </p>
  );
}

export default DeviceItemPrice;
