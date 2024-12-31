import "./styles/UserPageOrderExpandedDeliverySection.css";

const UserPageOrderExpandedDeliverySection = ({ order }) => {
  const storePickupPoint = order["store-pickup-point"];
  const orderCourierDelivery = order["order-courier-delivery"];

  let type;
  let deliveryTypeStr;
  let courierDeliveryAddressFullName;

  if (!!storePickupPoint) {
    type = "self-delivery";
    deliveryTypeStr = "Self-delivery";
  } else if (!!orderCourierDelivery) {
    type = "courier";
    deliveryTypeStr = "Courier";
    courierDeliveryAddressFullName = `${orderCourierDelivery.street} ${orderCourierDelivery.houseNumber}`;

    if (orderCourierDelivery.isToLiftOnTheFloor) {
      if (orderCourierDelivery.floor) {
        courierDeliveryAddressFullName += `, ${orderCourierDelivery.floor}th floor`;
      }
  
      if (orderCourierDelivery.flatNumber) {
        courierDeliveryAddressFullName += `, flat number ${orderCourierDelivery.flatNumber}`;
      }
    }
  }

  if (!type) {
    console.log("the passed order prop is incorrect!");
    return <div />;
  }

  return (
    <section className="user-page-order-expanded-delivery-section">
      <h4>
        Delivery info
      </h4>
      <dl className="user-page-order-expanded-delivery-info-list">
        <div>
          <dt>Delivery type</dt>
          <dd>{deliveryTypeStr}</dd>
        </div>
        {type === "self-delivery" &&
          <div>
            <dt>Store pickup point</dt>
            <dd>
              {storePickupPoint.fullName}
            </dd>
          </div>
        }
        {type === "courier" &&
          <div>
            <dt>Delivery address</dt>
            <dd>{courierDeliveryAddressFullName}</dd>
          </div>
        }
        <div>
          <dt>Receivent</dt>
          <dd>
            <p>{order?.receivent.name} {order?.receivent.surname} {order?.receivent.patronymic}</p>
            <p>{order?.receivent.phoneNumber}</p>
          </dd>
        </div>
      </dl>
    </section>
  );
}

export default UserPageOrderExpandedDeliverySection;
