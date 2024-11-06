import "./styles/UserPageOrderExpandedDeviceListItem.css";
import { useContext, useState } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import DeviceSalesActions from "../utils/DeviceSalesActions";
import { getDiscountedPrice } from "../utils/getDiscountedPrice";
import { Link } from "react-router-dom";
import DeviceItemPrice from "./DeviceItemPrice";
import { DEVICE_ROUTE } from "../utils/consts";
import AdditionalServicesSection from "./AdditionalServicesSection";

const UserPageOrderExpandedDeviceListItem = observer(({ 
  orderCombo, orderSelectedAdditionalServices, additionalServicesObj 
}) => {
  const { deviceStore } = useContext(Context);

  const [selectedAddServices, setSelectedAddServices] = useState(
    orderSelectedAdditionalServices?.["selected-additional-services"]?.[orderCombo.id] || []
  );

  if (!deviceStore.hasTriedToFetchSales) return <div />;

  const deviceRouteCombo = orderCombo["device-combination"].combinationString || "default";
  const to = DEVICE_ROUTE + `${orderCombo["device-combination"].device.id}--${deviceRouteCombo}`;

  let { discountPercentage } = DeviceSalesActions.getSaleTypesAndDiscount(
    orderCombo["device-combination"].device, deviceStore.sales, deviceStore.saleTypeNames, deviceStore.hasTriedToFetchSales
  );

  if (discountPercentage === undefined) {
    discountPercentage = 0;
  };

  const discountedPrice = getDiscountedPrice(orderCombo["device-combination"].price, discountPercentage);

  return (
    <div className="user-page-order-device-list-item">
      <div>
        <Link to={to} className="user-page-order-device-img-wrap">
          <img
            src={orderCombo["device-combination"].images[0].src}
            alt=""
            draggable="false"
          />
        </Link>
        <div className="user-page-order-device-info">
          <Link to={to} className="link-colors">
            {orderCombo["device-combination"].device.name} ({orderCombo["device-combination"].sku})
          </Link>
          <div className="user-page-order-device-price-row">
            <div>
              <DeviceItemPrice
                price={orderCombo["device-combination"].price}
                discountPercentage={discountPercentage}
              />
              <span>x {orderCombo.amount} pcs.</span>
            </div>
            <DeviceItemPrice price={(discountedPrice * orderCombo.amount).toFixed(2)} />
          </div>
        </div>
      </div>
      {!!additionalServicesObj?.length &&
        <AdditionalServicesSection
          additionalServices={additionalServicesObj}
          selectedItems={selectedAddServices}
          setSelectedItems={setSelectedAddServices}
          isReadOnly={true}
        />
      }
    </div>
  );
});

export default UserPageOrderExpandedDeviceListItem;
