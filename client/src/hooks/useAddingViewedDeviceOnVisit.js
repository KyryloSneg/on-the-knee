import { useCallback, useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import { createViewedDevice, deleteViewedDevice, getOneViewedDevicesListDevs } from "../http/ViewedDevicesAPI";
import _ from "lodash";
import { v4 } from "uuid";
import deleteFetchWithTryCatch from "utils/deleteFetchWithTryCatch";

// passing prevDeviceCombinationIdRef to use it properly in tabs page layout 
// without unnecessary ref.current resets on tab switches
export default function useAddingViewedDeviceOnVisit(deviceId, deviceCombinationId, prevDeviceCombinationIdRef) {
  const { app, user, fetchRefStore } = useContext(Context);

  const deviceIdRef = useRef(deviceId);
  const deviceCombinationIdRef = useRef(deviceCombinationId);

  useEffect(() => {
    deviceIdRef.current = deviceId;
  }, [deviceId]);

  useEffect(() => {
    deviceCombinationIdRef.current = deviceCombinationId;
  }, [deviceCombinationId]);

  const callback = useCallback(async () => {
    try {
      if (deviceIdRef.current === null || deviceIdRef.current === undefined) return;
      if (deviceCombinationIdRef.current === null || deviceCombinationIdRef.current === undefined) return;

      if (fetchRefStore.isAlreadyAddingViewedDevice || fetchRefStore.isAlreadyAddingViewedDeviceCleanupTimeoutId) return;
      fetchRefStore.setIsAlreadyAddingViewedDevice(true);

      function createViewedDevObj() {
        const viewedDev = {
          "id": v4(),
          "viewed-devices-listId": user.viewedDevicesList.id,
          "deviceId": deviceIdRef.current,
          "device-combinationId": deviceCombinationIdRef.current,
          "date": (new Date()).toISOString(),
        };

        return viewedDev;
      }

      async function authAddViewedDeviceLogic() {
        const viewedDev = createViewedDevObj();
        await createViewedDevice(viewedDev);
      };

      function nonAuthAddViewedDeviceLogic() {
        const viewedDev = createViewedDevObj();
        // the new viewed device must always be the first one
        newNonAuthViewedDevices.unshift(viewedDev);
      };

      let newNonAuthViewedDevices = _.cloneDeep(user.viewedDevices);
      const existingViewedDevice =
        user.viewedDevices?.find(viewedDev => viewedDev["device-combinationId"] === deviceCombinationIdRef.current);

      // if the existing viewed device is the latest added one, do not do anything
      // (the condition is fullfilled if viewed devices list is empty)
      if (existingViewedDevice?.id !== user.viewedDevices?.[0]?.id || !user.viewedDevices?.length) {
        // if there is already existing viewed device (and the viewed devs list isn't empty), ...
        if ((!!existingViewedDevice && !!user.viewedDevices?.length)) {
          if (user.isAuth) {
            // delete the viewed device and create it once again with 
            // the new creation date of the viewed devices list
            await deleteFetchWithTryCatch(async () => await deleteViewedDevice(existingViewedDevice.id));
            await authAddViewedDeviceLogic();

            const updatedViewedDevices = await getOneViewedDevicesListDevs(user.viewedDevicesList?.id);
            user.setViewedDevices(updatedViewedDevices);
          } else {
            newNonAuthViewedDevices = newNonAuthViewedDevices.filter(viewedDev => viewedDev.id !== existingViewedDevice.id);
            nonAuthAddViewedDeviceLogic();

            let newLocalStorageViewedDevices = _.cloneDeep(newNonAuthViewedDevices);
            for (let newLocalViewedDev of newLocalStorageViewedDevices) {
              delete newLocalViewedDev.device;
              delete newLocalViewedDev["device-combination"];
            }

            localStorage.setItem("viewedDevices", JSON.stringify(newLocalStorageViewedDevices));
            user.setViewedDevices(newNonAuthViewedDevices);
          };
        } else {      
          // otherwise ...
          if (user.isAuth) {
            await authAddViewedDeviceLogic();
            
            const updatedViewedDevices = await getOneViewedDevicesListDevs(user.viewedDevicesList?.id);
            user.setViewedDevices(updatedViewedDevices);
          } else {
            nonAuthAddViewedDeviceLogic();

            let newLocalStorageViewedDevices = _.cloneDeep(newNonAuthViewedDevices);
            for (let newLocalViewedDev of newLocalStorageViewedDevices) {
              delete newLocalViewedDev.device;
              delete newLocalViewedDev["device-combination"];
            };

            localStorage.setItem("viewedDevices", JSON.stringify(newLocalStorageViewedDevices));
            user.setViewedDevices(newNonAuthViewedDevices);
          }
        };
      }
    } catch (e) {
      console.log(e.message);
    } finally {
      prevDeviceCombinationIdRef.current = deviceCombinationIdRef.current;

      if (!fetchRefStore.isAlreadyAddingViewedDeviceCleanupTimeoutId && fetchRefStore.isAlreadyAddingViewedDevice) {
        const timeoutId = setTimeout(() => { 
          fetchRefStore.setIsAlreadyAddingViewedDevice(false);
          fetchRefStore.setIsAlreadyAddingViewedDeviceCleanupTimeoutId(null);
        }, 2000);
        
        fetchRefStore.setIsAlreadyAddingViewedDeviceCleanupTimeoutId(timeoutId);
      }

      fetchRefStore.setIsAlreadyAddingViewedDevice(false);
    };
  }, [user, fetchRefStore, prevDeviceCombinationIdRef]);

  useEffect(() => {
    // there's no sense to add already the latest created viewed device
    // (idk the cases where it could possibly happen but let it be here)
    if (deviceCombinationId !== prevDeviceCombinationIdRef.current && app.hasTriedToFetchInitialData) callback();
    // adding user.isAuth to add device to the viewed ones on log in
  }, [
    user, user.isAuth, deviceCombinationId, prevDeviceCombinationIdRef, 
    deviceId, app.hasTriedToFetchInitialData, callback
  ]);
};