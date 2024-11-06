import "./styles/ViewedDeviceHistoryDeletionBtn.css";
import { observer } from "mobx-react-lite";
import { useCallback, useContext, useRef, useState } from 'react';
import { Context } from "../Context";
import { deleteViewedDevice, getOneViewedDevicesListDevs } from "../http/ViewedDevicesAPI";
import Loader from "./UI/loader/Loader";
import trashCanIcon from "../assets/delete_24x24_434343.svg";

const ViewedDeviceHistoryDeletionBtn = observer(({ deviceId, deviceCombinationId }) => {
  const { user } = useContext(Context);
  const isAlreadyDeletingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const deleteDeviceHistory = useCallback(async () => {
    if (isAlreadyDeletingRef.current) return;

    isAlreadyDeletingRef.current = true;
    setIsLoading(true);

    try {
      if (deviceId === null || deviceId === undefined) throw new Error("deviceId can't be null or undefined");
      if (deviceCombinationId === null || deviceCombinationId === undefined) {
        throw new Error("deviceCombinationId can't be null or undefined");
      };

      const existingViewedDevice =
        user.viewedDevices?.find(viewedDev => viewedDev["device-combinationId"] === deviceCombinationId);

      if (existingViewedDevice) {
        try {
          await deleteViewedDevice(existingViewedDevice.id);
        } catch (e) {
          if (e.response.status !== 500) {
            throw e
          }
        }
      }

      const updatedViewedDevices = await getOneViewedDevicesListDevs(user.viewedDevicesList?.id);
      user.setViewedDevices(updatedViewedDevices);
    } catch (e) {
      console.log(e.message);
    } finally {
      isAlreadyDeletingRef.current = false;
      setIsLoading(false);
    }
  }, [user, isAlreadyDeletingRef, deviceId, deviceCombinationId])

  const isAdded = !!user.viewedDevices?.find(viewedDev => {
    return viewedDev["device-combinationId"] === deviceCombinationId
  });

  // device must be viewed by user before he could see this button
  if (!isAdded) return <div className="display-none" />;

  return (
    <button className="viewed-device-history-deletion-btn" onClick={deleteDeviceHistory}>
      {/* it's better to pass some heading, paragraph etc. that will give user the context 
          of the img alt text "Remove from the history" 
      */}
      {isLoading
        ? <Loader className="viewed-device-history-deletion-btn-loader" />
        : (
          <img
            src={trashCanIcon}
            alt="Remove from the history"
            draggable="false"
          />
        )
      }
    </button>
  );
});

export default ViewedDeviceHistoryDeletionBtn;
