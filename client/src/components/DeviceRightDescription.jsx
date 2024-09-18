import "./styles/DeviceRightDescription.css";
import { forwardRef } from "react";
import AdditionalServicesSection from "./AdditionalServicesSection";
import DeviceColorOptions from "./DeviceColorOptions";
import DeviceItemAttrOptionSection from "./DeviceItemAttrOptionSection";
import DevicePurchaseSection from "./DevicePurchaseSection";
import DeviceRightDescHeading from "./DeviceRightDescHeading";
import DeviceRightDescSales from "./DeviceRightDescSales";
import DeviceSellerBlock from "./DeviceSellerBlock";
import UserLocationBtn from "./UserLocationBtn";
import DeviceRightDescDeliveryList from "./DeviceRightDescDeliveryList";

const DeviceRightDescription = forwardRef(({ 
  device, combinationString, selectedCombination, 
  defaultCombo, salesAndTypes, attributesList, 
  hrefObjects, seller, price, discountPercentage,
  additionalServicesObj, selectedAddServices, 
  deviceSaleTypes, setSelectedAddServices, isInitialRenderRef
}, ref) => {
  if (isInitialRenderRef.current) isInitialRenderRef.current = false;

  return (
    <section className="device-page-section device-right-description" ref={ref}>
      <DeviceRightDescHeading
        device={device}
        selectedCombination={selectedCombination}
        defaultCombo={defaultCombo}
      />
      {!!salesAndTypes.length && <DeviceRightDescSales salesAndTypes={salesAndTypes} />}
      {combinationString !== "default" &&
        <div className="device-right-desc-combo-select-wrap">
          {!!attributesList.length &&
            <DeviceItemAttrOptionSection
              attributesList={attributesList}
              deviceId={device.id}
              defaultCombo={selectedCombination}
              isWithParagraph={true}
              isListbox={true}
              isDefaultDiv={true}
            />
          }
          {!!hrefObjects.length &&
            <div className="device-color-options-p-wrap">
              <p>Color</p>
              <DeviceColorOptions
                hrefObjects={hrefObjects}
                deviceId={device.id}
                toShowSelectedOutline={true}
                isDefaultDiv={true}
              />
            </div>
          }
        </div>
      }
      <AdditionalServicesSection 
        additionalServices={additionalServicesObj}
        selectedItems={selectedAddServices}
        setSelectedItems={setSelectedAddServices} 
      />
      <div className="device-right-desc-seller-purchase-wrap">
        <DeviceSellerBlock seller={seller} />
        <DevicePurchaseSection 
          price={price} 
          discountPercentage={discountPercentage} 
          device={device} 
          selectedCombo={selectedCombination}
          selectedAddServices={selectedAddServices}
        />
      </div>
      <DeviceRightDescDeliveryList deviceSaleTypes={deviceSaleTypes} />
      <UserLocationBtn additionalText="Deliver to" className="device-right-desc-location-btn" />
    </section>
  );
});

export default DeviceRightDescription;
