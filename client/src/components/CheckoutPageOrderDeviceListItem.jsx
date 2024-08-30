import "./styles/CheckoutPageOrderDeviceListItem.css";
import { useContext, useRef, useState } from "react";
import DeviceSalesActions from "../utils/DeviceSalesActions";
import DeviceItemPrice from "./DeviceItemPrice";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/consts";
import AdditionalServicesSection from "./AdditionalServicesSection";
import useGettingAddServicesRelatedData from "../hooks/useGettingAddServicesRelatedData";
import { getDiscountedPrice } from "../utils/getDiscountedPrice";
import useSynchronizingAdditionalServices from "../hooks/useSynchronizingAdditionalServices";
import useChangingServerAddServicesOnChange from "../hooks/useChangingServerAddServicesOnChange";

const CheckoutPageOrderDeviceListItem = observer(({ combination, cartDataFetching }) => {
  const { deviceStore, user } = useContext(Context);
  const isInitialRender = useRef(true);

  let initSelectedItems = [];
  if (user.cartSelectedAdditionalServices["selected-additional-services"]) {
    initSelectedItems = user.cartSelectedAdditionalServices["selected-additional-services"][combination.id] || [];
  }

  const [selectedAddServices, setSelectedAddServices] = useState(initSelectedItems);
  const [additionalServicesObj, setAdditionalServicesObj] = useState([]);

  useSynchronizingAdditionalServices(setSelectedAddServices, combination.id);
  useChangingServerAddServicesOnChange(selectedAddServices, combination.id, cartDataFetching, isInitialRender);
  
  useGettingAddServicesRelatedData(combination.device, setAdditionalServicesObj);

  const deviceRouteCombo = combination["device-combination"].combinationString || "default";
  const to = DEVICE_ROUTE + `${combination.device.id}--${deviceRouteCombo}`;

  let { discountPercentage } = DeviceSalesActions.getSaleTypesAndDiscount(
    combination.device, deviceStore.sales, deviceStore.saleTypeNames
  );

  if (discountPercentage === undefined) {
    discountPercentage = 0;
  };

  const discountedPrice = getDiscountedPrice(combination["device-combination"].price, discountPercentage);
  if (isInitialRender.current) isInitialRender.current = false;

  return (
    <div className="checkout-page-order-device-list-item">
      <div>
        <Link to={to} className="order-device-item-img-wrap">
          <img
            src={combination["device-combination"].images[0].src}
            alt=""
            draggable="false"
          />
        </Link>
        <div className="order-device-item-info">
          <Link to={to} className="link-colors">
            {combination.device.name} ({combination["device-combination"].sku})
          </Link>
          <div className="order-device-item-price-row">
            <div>
              <DeviceItemPrice
                price={combination["device-combination"].price}
                discountPercentage={discountPercentage}
              />
              <span>x {combination.amount} pcs.</span>
            </div>
            <DeviceItemPrice price={(discountedPrice * combination.amount).toFixed(2)} />
          </div>
        </div>
      </div>
      {!!additionalServicesObj?.length &&
        <AdditionalServicesSection
          additionalServices={additionalServicesObj}
          selectedItems={selectedAddServices}
          setSelectedItems={setSelectedAddServices}
        />
      }
    </div>
  );
});

export default CheckoutPageOrderDeviceListItem;
