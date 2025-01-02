import { useContext } from 'react';
import DeviceList from "./DeviceList";
import { Context } from "Context";
import { observer } from "mobx-react-lite";
import _ from "lodash";

const ViewedDevicesList = observer(({ withHistoryDeletionBtn = true, devicesMaxAmount = Infinity }) => {
  const { user } = useContext(Context);

  let devices = [];
  if (Array.isArray(user.viewedDevices)) {
    let viewedDevs;
    if (devicesMaxAmount === Infinity) {
      viewedDevs = user.viewedDevices;
    } else {
      viewedDevs = user.viewedDevices.slice(0, devicesMaxAmount);
    }

    for (let viewedDev of viewedDevs) {
      const deviceToPush = _.cloneDeep(viewedDev.device);
      // making it possible to use certain dev combo in the DeviceList 
      deviceToPush.deviceCombinationId = viewedDev["device-combinationId"];

      devices.push(deviceToPush);
    }
  }

  if (!devices.length) return;

  return (
    <DeviceList
      devices={devices}
      areDevsWithCertainDevComboId={true}
      withHistoryDeletionBtn={withHistoryDeletionBtn}
    />
  );
});

export default ViewedDevicesList;
