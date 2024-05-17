import DeviceRightDescHeading from "./DeviceRightDescHeading";
import "./styles/DeviceRightDescription.css";

const DeviceRightDescription = ({ device, selectedCombination, defaultCombo, sales, logoSaleTypes }) => {
  return (
    <section className="device-page-section device-right-description">
      <DeviceRightDescHeading 
        device={device} 
        selectedCombination={selectedCombination}
        defaultCombo={defaultCombo}
      />
    </section>
  );
}

export default DeviceRightDescription;
