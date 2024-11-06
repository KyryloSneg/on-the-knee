import "./styles/DeviceItemImageBtns.css";
import AddToDesiredListBtn from "./AddToDesiredListBtn";
import ViewedDeviceHistoryDeletionBtn from "./ViewedDeviceHistoryDeletionBtn";

const DeviceItemImageBtns = ({ deviceId, combinationId, withHistoryDeletionBtn }) => {
  return (
    <div className="main-device-item-image-btns">
      <AddToDesiredListBtn deviceId={deviceId} deviceCombinationId={combinationId} />
      {withHistoryDeletionBtn && (
        <ViewedDeviceHistoryDeletionBtn 
          deviceId={deviceId}
          deviceCombinationId={combinationId}
        />
      )}
    </div>
  );
}

export default DeviceItemImageBtns;
