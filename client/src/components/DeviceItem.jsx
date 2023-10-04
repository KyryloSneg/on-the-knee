import { Link } from "react-router-dom";
import "./styles/DeviceItem.css";
import DeviceComboActions from "../utils/DeviceComboActions";
import DeviceColorOptions from "./DeviceColorOptions";
import DeviceItemAvgRating from "./DeviceItemAvgRating";
import DeviceItemPrice from "./DeviceItemPrice";
import { useContext } from "react";
import { Context } from "../Context";
import DeviceItemImage from "./DeviceItemImage";
import DeviceItemAddToCartBtn from "./DeviceItemAddToCartBtn";
import DeviceItemHiddenContent from "./DeviceItemHiddenContent";
import DeviceSalesActions from "../utils/DeviceSalesActions";

const DeviceItem = ({ device, isInStock, defaultCombination }) => {
  const { deviceStore } = useContext(Context);

  // a device's combination string could be null, so we have to handle it 
  const defaultComboColorHrefs = defaultCombination.combinationString
    ? DeviceComboActions.getDefaultComboAttrHrefs(
      defaultCombination,
      device["device-combinations"],
      device.id,
      deviceStore.stocks,
      ["color"],
      false,
    )
    : null;

  const defaultComboColorHrefObjects = 
    DeviceComboActions.getComboColorHrefObjects(defaultComboColorHrefs, device, deviceStore.stocks);

  let attributesList = [];
  if (defaultCombination.combinationString) {
    attributesList = DeviceComboActions.getAttributesList(
      defaultCombination,
      deviceStore.stocks,
      device
    );
  }

  const { 
    deviceSaleTypes, 
    discountPercentage
  } = DeviceSalesActions.getSaleTypesAndDiscount(device, deviceStore.sales, deviceStore.saleTypeNames);

  const textSaleTypes = deviceSaleTypes.filter(type => !type.logo);
  const logoSaleTypes = deviceSaleTypes.filter(type => type.logo);

  // some hardcoded url route if combination string is null
  const to = `${device.id}/${defaultCombination?.combinationString || "default"}`;
  const thumbnail = defaultCombination.images[0];

  let className = "main-device-item";
  if (!isInStock) {
    className += " out-of-stock";
  }

  return (
    <section className={className}>
      <DeviceItemImage
        thumbnail={thumbnail}
        to={to}
        deviceId={device.id}
        textSaleTypes={textSaleTypes}
      />
      {defaultComboColorHrefs
        ? <DeviceColorOptions hrefObjects={defaultComboColorHrefObjects} />
        : <div className="device-color-options-placeholder" />
      }
      <Link to={to} className="main-device-name">
        {device.name}
      </Link>
      <DeviceItemAvgRating
        rating={device.rating}
        feedbackAmount={device["device-feedbacks"].length}
        id={device.id}
      />
      <div className="price-add-to-cart-wrap">
        <DeviceItemPrice price={defaultCombination.price} discountPercentage={discountPercentage} />
        <DeviceItemAddToCartBtn />
      </div>
      <DeviceItemHiddenContent
        logoSaleTypes={logoSaleTypes}
        deviceId={device.id}
        attributesList={attributesList}
        defaultCombo={defaultCombination}
      />
    </section>
  );
};

export default DeviceItem;
