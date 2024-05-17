import { useContext } from "react";
import DeviceItemAvgRating from "./DeviceItemAvgRating";
import "./styles/DeviceRightDescHeading.css";
import { Context } from "../Context";
import AddToDesiredListBtn from "./AddToDesiredListBtn";

const DeviceRightDescHeading = ({ device, selectedCombination, defaultCombo }) => {
  const { deviceStore } = useContext(Context);

  const stock = deviceStore.stocks.find(stockItem => stockItem.id === selectedCombination.stockId);
  const feedbackAmount = device["device-feedbacks"].length;

  return (
    <section className="device-right-desc-heading">
      <h2 className="device-right-desc-header">
        {device.name} ({selectedCombination.sku})
      </h2>
      <div className="device-right-desc-rate-code-wrap">
        <DeviceItemAvgRating 
          rating={device.rating} 
          feedbackAmount={feedbackAmount} 
          deviceId={device.id} 
          defaultCombination={defaultCombo}
        />
        <p className="device-right-desc-code">
          Code: <span>{selectedCombination.deviceCode}</span>
        </p>
      </div>
      <div className="device-right-desc-stock-desired-wrap">
        <p className="device-right-desc-stock">
          {stock.stockStatus}
        </p>
        <AddToDesiredListBtn />
      </div>
    </section>
  );
}

export default DeviceRightDescHeading;
