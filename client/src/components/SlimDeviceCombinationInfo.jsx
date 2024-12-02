import "./styles/SlimDeviceCombinationInfo.css";
import AdditionalServicesSection from "./AdditionalServicesSection";
import DeviceSalesActions from "utils/DeviceSalesActions";
import { DEVICE_ROUTE } from "utils/consts";
import { useContext } from "react";
import { Context } from "Context";
import { observer } from "mobx-react-lite";
import { getDiscountedPrice } from "utils/getDiscountedPrice";
import DeviceItemPrice from "./DeviceItemPrice";
import { Link } from "react-router-dom";

const POSSIBLE_TYPES = ["checkout-page", "user-page"];

const SlimDeviceCombinationInfo = observer(({ 
  type, orderCombo, additionalServicesObj, selectedAddServices, setSelectedAddServices, isReadOnlyAddServices = false 
}) => {
  const { deviceStore } = useContext(Context);
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of SlimDeviceCombinationInfo is not defined or incorrect");

  const device = orderCombo?.device || orderCombo["device-combination"]?.device;

  const deviceRouteCombo = orderCombo["device-combination"].combinationString || "default";
  const to = DEVICE_ROUTE + `${device.id}--${deviceRouteCombo}`;

  let { discountPercentage } = DeviceSalesActions.getSaleTypesAndDiscount(
    device, deviceStore.sales, deviceStore.saleTypeNames, deviceStore.hasTriedToFetchSales
  );

  if (discountPercentage === undefined) {
    discountPercentage = 0;
  };

  const discountedPrice = getDiscountedPrice(orderCombo["device-combination"].price, discountPercentage);
  let className = "slim-device-combination-info";
  className += ` ${type}-version`;

  return (
    <div className={className}>
      <div>
        <Link to={to} className="slim-device-combination-info-img-wrap">
          <img
            src={orderCombo["device-combination"].images[0].src}
            alt=""
            draggable="false"
          />
        </Link>
        <div className="slim-device-combination-info-info">
          <Link to={to} className="link-colors">
            {device.name} ({orderCombo["device-combination"].sku})
          </Link>
          <div className="slim-device-combination-info-price-row">
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
          isReadOnly={isReadOnlyAddServices}
        />
      }
    </div>
  );
});

export default SlimDeviceCombinationInfo;
