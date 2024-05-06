function filterDevicesWithCommonFilters(device, attributes, filtersWithoutSpecial) {
  let allDeviceInfo = {};

  // adding every device info in the loop
  for (let info of device["device-infos"]) {
    // material: cotton
    allDeviceInfo[info.name] = [info.value];
  }

  const deviceAttributes = attributes.filter(attr => attr.deviceId === device.id);
  // adding every device attribute in the loop (if it has ones)
  for (let attr of deviceAttributes) {
    if (allDeviceInfo[attr.name]) {
      allDeviceInfo[attr.name].push(attr.value);
    } else {
      allDeviceInfo[attr.name] = [attr.value];
    }
  }

  for (let [key, values] of Object.entries(filtersWithoutSpecial)) {
    // usedFilters: { color: ["red"] }
    // infos: { material: ["cotton"], color: ["purple#121242", "red#121442"] }

    if (!allDeviceInfo[key]) return false;

    for (let info of allDeviceInfo[key]) {
      const infoToCheck = key === "color"
        ? info?.split("_")[0]
        : info;

      const isIncluded = values?.includes(infoToCheck);
      if (!isIncluded) {
        if (allDeviceInfo[key].length === 1) return false;
        // else leaving only device combinations that have such an attribute
        else {
          device["device-combinations"] = device["device-combinations"].filter(combo => {
            const combinationStringAttrs = combo.combinationString.split("-");
            const [, value] = combinationStringAttrs.find(attr => attr.startsWith(`${key}:`)).split(":");

            // if the current combination contains attribute that is not included in the used filters,
            // delete it
            return value.toLowerCase() !== info.toLowerCase();
          });

          if (!device["device-combinations"].length) return false;

          const defaultCombo = device["device-combinations"].find(combo => combo.default);
          if (!defaultCombo) {
            // same as in the price filtering logic
            device["device-combinations"][0].default = true;
          }
        }
      }
    }

  }

  // if some device combinations are left, leave current device then
  return true;
}

export default filterDevicesWithCommonFilters