import { Link } from "react-router-dom";
import "./styles/DeviceItem.css";
import DeviceComboActions from "../utils/DeviceComboActions";
import DeviceColorOptions from "./DeviceColorOptions";
import DeviceItemAvgRating from "./DeviceItemAvgRating";
import DeviceItemPrice from "./DeviceItemPrice";
import DeviceItemImage from "./DeviceItemImage";
import DeviceItemAddToCartBtn from "./DeviceItemAddToCartBtn";
import DeviceItemHiddenContent from "./DeviceItemHiddenContent";
import DeviceSalesActions from "../utils/DeviceSalesActions";
import useWindowWidth from "../hooks/useWindowWidth";

const DeviceItem = ({ device, isInStock, defaultCombination, stocks, sales, saleTypeNames }) => {
  const screenWidth = useWindowWidth();

  // a device's combination string could be null, so we have to handle it 
  const defaultComboColorHrefs = defaultCombination.combinationString
    ? DeviceComboActions.getDefaultComboAttrHrefs(
      defaultCombination,
      device["device-combinations"],
      device.id,
      stocks,
      ["color"],
      false,
    )
    : null;

  const defaultComboColorHrefObjects =
    DeviceComboActions.getComboColorHrefObjects(defaultComboColorHrefs, device, stocks);

  let attributesList = [];
  let discountPercentage = null;
  let textSaleTypes = [];
  let logoSaleTypes = [];

  if (screenWidth > 960) {

    if (defaultCombination.combinationString) {
      attributesList = DeviceComboActions.getAttributesList(
        defaultCombination,
        stocks,
        device
      );
    }

    const {
      deviceSaleTypes,
      discountPercentage: saleDiscountPercentage
    } = DeviceSalesActions.getSaleTypesAndDiscount(device, sales, saleTypeNames);

    textSaleTypes = deviceSaleTypes.filter(type => !type.logo);
    logoSaleTypes = deviceSaleTypes.filter(type => type.logo);
    
    discountPercentage = saleDiscountPercentage;
  }

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
        {`${device.name} (${defaultCombination.sku})`}
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
      {!isInStock
        ? <p className="main-device-stock-alert">Not in stock</p>
        : <div className="main-device-stock-alert-placeholder" />
      }
      {screenWidth >= 960 &&
        <DeviceItemHiddenContent
          logoSaleTypes={logoSaleTypes}
          deviceId={device.id}
          attributesList={attributesList}
          defaultCombo={defaultCombination}
          deviceInfos={device["device-infos"]}
        />
      }
    </section>
  );
};

export default DeviceItem;
