import "./styles/UserPageOrderExpandedPriceSection.css";

const UserPageOrderExpandedPriceSection = ({ order }) => {
  let devicePriceWord = "Device";
  if (order.totalDeviceAmount > 1) {
    devicePriceWord = "Devices";
  }

  let additionalServicesAmount = 0;

  const selectedAddServicesObj = order?.["order-selected-additional-services"]?.["selected-additional-services"] || {};
  for (let [, services] of Object.entries(selectedAddServicesObj)) {
    additionalServicesAmount += services.length;
  }

  let addServicesPriceWord = "Service";
  if (additionalServicesAmount > 1) {
    addServicesPriceWord = "Services";
  }

  return (
    <dl className="user-page-order-expanded-price-section">
      <div>
        <dt>
          {order.totalDeviceAmount} {devicePriceWord}
        </dt>
        <dd>
          {order.devicePrice}$
        </dd>
      </div>
      {!!additionalServicesAmount && (
        <div>
          <dt>
            {additionalServicesAmount} {addServicesPriceWord}
          </dt>
          <dd>
            {order.additionalServicesPrice}$
          </dd>
        </div>
      )}
      <div>
        <dt>
          Delivery
        </dt>
        <dd>
          {order.deliveryPrice}$
        </dd>
      </div>
      <div>
        <dt>
          Total price
        </dt>
        <dd>
          {order.totalPrice}$
        </dd>
      </div>
    </dl>
  );
}

export default UserPageOrderExpandedPriceSection;
