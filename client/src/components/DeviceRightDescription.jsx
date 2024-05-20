import DeviceColorOptions from "./DeviceColorOptions";
import DeviceItemAttrOptionSection from "./DeviceItemAttrOptionSection";
import DeviceRightDescHeading from "./DeviceRightDescHeading";
import DeviceRightDescSales from "./DeviceRightDescSales";
import "./styles/DeviceRightDescription.css";

const DeviceRightDescription = ({ device, combinationString, selectedCombination, defaultCombo, salesAndTypes, attributesList, hrefObjects }) => {
  return (
    <section className="device-page-section device-right-description">
      <DeviceRightDescHeading
        device={device}
        selectedCombination={selectedCombination}
        defaultCombo={defaultCombo}
      />
      {!!salesAndTypes.length && <DeviceRightDescSales salesAndTypes={salesAndTypes} />}
      {combinationString !== "default" &&
        <div className="device-right-desc-combo-select-wrap">
          {attributesList.length &&
            <DeviceItemAttrOptionSection
              attributesList={attributesList}
              deviceId={device.id}
              defaultCombo={selectedCombination}
              isWithParagraph={true}
              isListbox={true}
              isDefaultDiv={true}
            />
          }
          {hrefObjects.length &&
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
    </section>
  );
}

export default DeviceRightDescription;
