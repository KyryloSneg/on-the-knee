import DeviceRightDescHeading from "./DeviceRightDescHeading";
import DeviceRightDescSales from "./DeviceRightDescSales";
import "./styles/DeviceRightDescription.css";

const DeviceRightDescription = ({ device, selectedCombination, defaultCombo, salesAndTypes }) => {
  return (
    <section className="device-page-section device-right-description">
      <DeviceRightDescHeading 
        device={device} 
        selectedCombination={selectedCombination}
        defaultCombo={defaultCombo}
      />
      {!!salesAndTypes.length && <DeviceRightDescSales salesAndTypes={salesAndTypes} />}
    </section>
  );
}

export default DeviceRightDescription;
