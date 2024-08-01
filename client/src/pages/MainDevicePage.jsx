import "./styles/MainDevicePage.css";
import DeviceImagesCarousel from "../components/DeviceImagesCarousel";
import DeviceInfoSection from "../components/DeviceInfoSection";
import DeviceRightDescription from "../components/DeviceRightDescription";
import CommentsSection from "../components/CommentsSection";
import DeviceSalesActions from "../utils/DeviceSalesActions";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../Context";
import useGettingSalesAndTypeNames from "../hooks/useGettingSalesAndTypeNames";
import { observer } from "mobx-react-lite";
import DeviceComboActions from "../utils/DeviceComboActions";
import useGettingSellers from "../hooks/useGettingSellers";
import useGettingAddServicesRelatedData from "../hooks/useGettingAddServicesRelatedData";
import PurchaseDeviceFooter from "../components/PurchaseDeviceFooter";
import useWindowWidth from "../hooks/useWindowWidth";
import { WIDTH_TO_SHOW_PURCHASE_DEVICE_FOOTER } from "../utils/consts";

const MainDevicePage = observer(({ device, combinationString, feedbacks }) => {
  const { deviceStore } = useContext(Context);
  const windowWidth = useWindowWidth();

  const observer = useRef(null);
  const rightDescRef = useRef(null);

  const [sellers, setSellers] = useState([]);
  const [additionalServicesObj, setAdditionalServicesObj] = useState([]);
  const [isRightDescScrolled, setIsRightDescScrolled] = useState(false);
  // theoretically setting sales and sale type names would not lead to bugs in the catalog page
  useGettingSalesAndTypeNames(deviceStore);
  useGettingSellers(setSellers);
  useGettingAddServicesRelatedData(device, setAdditionalServicesObj);

  // i think we can implement it without the observer but i already did it
  useEffect(() => {
    if (rightDescRef.current) {
      if (observer.current) observer.current.disconnect();

      function callback(entries, observer) {
        const rightDescRect = rightDescRef.current.getBoundingClientRect();
        const isScrolled = rightDescRect.top <= -(rightDescRect.height);

        const nextIsRightDescScrolled = !entries[0].isIntersecting && isScrolled;

        if (nextIsRightDescScrolled !== isRightDescScrolled) {
          setIsRightDescScrolled(nextIsRightDescScrolled);
        }
      }

      observer.current = new IntersectionObserver(callback);
      observer.current.observe(rightDescRef.current);
    }

    return () => {
      observer.current?.disconnect();
    };

    // putting rightDescRef.current into deps is necessarry
    // eslint-disable-next-line
  }, [isRightDescScrolled, rightDescRef.current]);

  if (!device || !deviceStore.sales.length || !deviceStore.stocks.length || !sellers.length) {
    return <div />
  }

  const devCombos = device["device-combinations"];
  const defaultCombo = devCombos.find(combo => combo.default);
  let selectedCombination;

  if (devCombos.length > 1) {
    selectedCombination = devCombos.find(combo => combo.combinationString === combinationString);
  } else {
    selectedCombination = devCombos[0];
  }

  let deviceSaleTypes = [];
  let textSaleTypes = [];
  let logoSaleTypes = [];

  if (deviceStore.sales?.length && deviceStore.saleTypeNames?.length) {
    deviceSaleTypes = (DeviceSalesActions.getSaleTypesAndDiscount(
      device, deviceStore.sales, deviceStore.saleTypeNames
    )).deviceSaleTypes;

    textSaleTypes = deviceSaleTypes.filter(type => !type.logo);
    logoSaleTypes = deviceSaleTypes.filter(type => type.logo);
  }

  const salesIds = device["sale-devices"].map(saleDev => saleDev.saleId);
  const sales = deviceStore.sales.filter(sale => salesIds.includes(sale.id));

  let salesAndTypes = [];
  for (let sale of sales) {
    const saleAndTypeObj = {
      sale: sale,
      saleTypes: deviceSaleTypes.filter(type => type.saleId === sale.id),
    }

    salesAndTypes.push(saleAndTypeObj);
  }

  let attributesList = []
  if (combinationString && combinationString !== "default") {
    attributesList = DeviceComboActions.getAttributesList(
      defaultCombo,
      deviceStore.stocks,
      device
    );
  }

  const selectedComboColorHrefs = combinationString && combinationString !== "default"
    ? DeviceComboActions.getDefaultComboAttrHrefs(
      selectedCombination,
      device["device-combinations"],
      device.id,
      deviceStore.stocks,
      ["color"],
      false,
    )
    : null;


  const selectedComboColorHrefObjects =
    DeviceComboActions.getComboColorHrefObjects(selectedComboColorHrefs, device, deviceStore.stocks);

  const seller = sellers.find(sellerItem => sellerItem.id === device.sellerId);
  const price = selectedCombination.price;
  const { discountPercentage } =
    DeviceSalesActions.getSaleTypesAndDiscount(device, sales, deviceStore.saleTypeNames)
    || { discountPercentage: 0 };

  return (
    <section className="main-device-page">
      <div className="dev-images-description-wrap">
        <DeviceImagesCarousel
          device={device}
          selectedCombination={selectedCombination}
          textSaleTypes={textSaleTypes}
          logoSaleTypes={logoSaleTypes}
        />
        <DeviceRightDescription
          device={device}
          combinationString={combinationString}
          selectedCombination={selectedCombination}
          defaultCombo={defaultCombo}
          salesAndTypes={salesAndTypes}
          attributesList={attributesList}
          hrefObjects={selectedComboColorHrefObjects}
          seller={seller}
          price={price}
          discountPercentage={discountPercentage}
          additionalServicesObj={additionalServicesObj}
          ref={rightDescRef}
        />
      </div>
      <div className="dev-info-comments-wrap">
        <DeviceInfoSection device={device} combinationString={combinationString} />
        <CommentsSection 
          type="deviceFeedbacks" 
          comments={feedbacks} 
          isFullVersion={false}
          device={device}
        />
      </div>
      {(isRightDescScrolled && windowWidth >= WIDTH_TO_SHOW_PURCHASE_DEVICE_FOOTER) && 
        <PurchaseDeviceFooter device={device} selectedCombo={selectedCombination} 
      />}
    </section>
  );
});

export default MainDevicePage;
