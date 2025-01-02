import { useState } from "react";
import "./styles/DeviceInfoSection.css"
import useGettingDevicesByCategory from "../hooks/useGettingDevicesByCategory";
import DeviceInfoSectionList from "./DeviceInfoSectionList";

const DeviceInfoSection = ({ device, combinationString = null }) => {
  const [categoryDevices, setCategoryDevices] = useState([]);
  useGettingDevicesByCategory(device?.categoryId, setCategoryDevices);
  if (!device) return; 

  // {
  //   "nameSample1": ["valueSample1", "valueSample2"],
  //   "nameSample2": ["valueSample1", "valueSample2"],
  // }
  const additionalInfoObj = device["device-infos"].find(info => info.name === "additionalInfo");

  let deviceInfos = device["device-infos"];
  if (additionalInfoObj) {
    // moving additional info obj (if we have one) to the end of array 
    deviceInfos = [...device["device-infos"]].filter(info => info.name !== "additionalInfo");
    deviceInfos.push(additionalInfoObj);
  }

  let deviceInfosObj = {};

  if (categoryDevices?.length) {
    for (let device of categoryDevices) {
      for (let info of device["device-infos"]) {
        if (info.name === "additionalInfo") continue;
        if (deviceInfosObj[info.name]) {

          if (!deviceInfosObj[info.name].includes(info.value)) {
            deviceInfosObj[info.name].push(info.value);
          }

        } else {
          deviceInfosObj[info.name] = [info.value];
        }
      }
    }
  }

  let linkDeviceInfoNames = [];
  for (let [name, value] of Object.entries(deviceInfosObj)) {
    if (value.length >= 2) linkDeviceInfoNames.push(name);
  }

  return (
    <section className="device-page-section">
      <h2>Device Info</h2>
      <DeviceInfoSectionList 
        device={device} 
        deviceInfos={deviceInfos}
        linkDeviceInfoNames={linkDeviceInfoNames} 
        isFullVersion={false}
        combinationString={combinationString}
      />
    </section>
  );
}

export default DeviceInfoSection;
