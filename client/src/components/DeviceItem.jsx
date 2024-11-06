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
import { DEVICE_ROUTE, WIDTH_TO_SHOW_DEV_HID_CONTENT } from "../utils/consts";
import { useContext, useRef, useState } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";

const DeviceItem = observer(({ device, isInStock, isPreOrder, defaultCombination, withHistoryDeletionBtn }) => {
  const { deviceStore } = useContext(Context);

  const screenWidth = useWindowWidth();
  const deviceRef = useRef(null); 
  const [isVisibleHidContent, setIsVisibleHidContent] = useState(false);

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

  const {
    deviceSaleTypes,
    discountPercentage
  } = DeviceSalesActions.getSaleTypesAndDiscount(device, deviceStore.sales, deviceStore.saleTypeNames, deviceStore.hasTriedToFetchSales);

  const textSaleTypes = deviceSaleTypes.filter(type => !type.logo);
  const logoSaleTypes = deviceSaleTypes.filter(type => type.logo);

  let attributesList = [];
  if (screenWidth >= WIDTH_TO_SHOW_DEV_HID_CONTENT) {
    if (defaultCombination.combinationString) {
      attributesList = DeviceComboActions.getAttributesList(
        defaultCombination,
        deviceStore.stocks,
        device
      );
    }
  }

  const deviceRouteCombo = defaultCombination.combinationString || "default";
  const to = DEVICE_ROUTE + `${device.id}--${deviceRouteCombo}`;
  const thumbnail = defaultCombination.images[0];

  let className = "main-device-item";
  if (!isInStock && !isPreOrder) {
    className += " out-of-stock";
  }

  if (isVisibleHidContent) {
    className += " js-focused"
  }

  function showHiddenContent() {
    if (screenWidth < WIDTH_TO_SHOW_DEV_HID_CONTENT) return;
    if (isVisibleHidContent) return;

    setIsVisibleHidContent(true);
  }

  function hideHiddenContent(e) {
    if (screenWidth < WIDTH_TO_SHOW_DEV_HID_CONTENT) return;
    if (!isVisibleHidContent) return;
    // if the element that gained the focus is descendant of device section node
    // ignore hiding the content
    if (deviceRef.current.contains(e.relatedTarget)) return;

    setIsVisibleHidContent(false);
  }

  return (
    <section 
      className={className}
      onFocus={showHiddenContent}
      onBlurCapture={hideHiddenContent}
      ref={deviceRef}
    >
      <DeviceItemImage
        thumbnail={thumbnail}
        to={to}
        deviceId={device.id}
        combinationId={defaultCombination.id}
        textSaleTypes={textSaleTypes}
        withHistoryDeletionBtn={withHistoryDeletionBtn}
      />
      {defaultComboColorHrefs
        ? <DeviceColorOptions hrefObjects={defaultComboColorHrefObjects} deviceId={device.id} />
        : <div className="device-color-options-placeholder" />
      }
      <Link to={to} className="main-device-name">
        {`${device.name} (${defaultCombination.sku})`}
      </Link>
      <DeviceItemAvgRating
        rating={device.rating}
        feedbackAmount={device["device-feedbacks"].length}
        deviceId={device.id}
        defaultCombination={defaultCombination}
      />
      <div className="price-add-to-cart-wrap">
        <DeviceItemPrice price={defaultCombination.price} discountPercentage={discountPercentage} />
        {(isInStock || isPreOrder) && 
          <DeviceItemAddToCartBtn 
            combinations={device["device-combinations"]} 
            combo={defaultCombination} 
            isPreOrder={isPreOrder}
          />
        }
      </div>
      {(!isInStock && !isPreOrder)
        ? <p className="main-device-stock-alert">Not in stock</p>
        : <div className="main-device-stock-alert-placeholder" />
      }
      {screenWidth >= WIDTH_TO_SHOW_DEV_HID_CONTENT &&
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
});

export default DeviceItem;
