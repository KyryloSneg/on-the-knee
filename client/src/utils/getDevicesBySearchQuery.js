import { getDevices } from "../http/DeviceApi";
import spellCheck from "../http/SaplingAPI";
import URLActions from "./URLActions";
import { CLIENT_URL } from "./consts";
import getPreparedForMockServerStr from "./getPreparedForMockServerStr";

// using this function in two cases: to get devices or check will a search query return empty catalog page or no (by checking devices amount)
async function getDevicesBySearchQuery(fetchStringQueryParams, additionalCondition = true, setIsFoundDevicesByQuery = null, setSpellCheckedQuery = null, navigate = null, argDevices = []) {
  const searchQuery = URLActions.getParamValue("text");
  const preparedSearchQuery = typeof searchQuery === "string" ? getPreparedForMockServerStr(searchQuery) : searchQuery;

  // maybe redundant part, but it can help if i'll want to filter existing devices with this function
  let devices = [];
  if (argDevices.length) {
    devices = argDevices;
  } else {
    devices = (await getDevices(fetchStringQueryParams)).devices;
  }

  let spellCheckedSearchQuery = preparedSearchQuery;

  // failed spellCheck shouldn't affect the whole logic
  try {
    if (!devices.length && additionalCondition && preparedSearchQuery) {
      spellCheckedSearchQuery = await spellCheck(preparedSearchQuery);
  
      const fetchParams = fetchStringQueryParams.split("&");
      fetchParams[2] = `name_like=${spellCheckedSearchQuery}`.replaceAll(`"`, "");
  
      fetchStringQueryParams = fetchParams.join("&");
      devices = (await getDevices(fetchStringQueryParams)).devices || [];
    }
  } catch (e) {
    console.log(e.message);
  }

  if (additionalCondition) {
    if (!devices.length) {
      devices = (await getDevices()).devices;
      // it looks ugly as hell
      // device found by its combination's sku or deviceCode
      let foundDevice = devices.find(dev =>
        !!dev["device-combinations"].find(combo => combo.sku === preparedSearchQuery || combo.deviceCode === +preparedSearchQuery)
      ) || null;

      if (foundDevice) {
        const combination = foundDevice["device-combinations"]
          .find(combo => combo.sku === preparedSearchQuery || combo.deviceCode === +preparedSearchQuery);
        combination.default = true;
        foundDevice["device-combinations"] = [combination];
      }

      devices = foundDevice ? [foundDevice] : [];
    }

    if (devices.length && !!spellCheckedSearchQuery && spellCheckedSearchQuery !== preparedSearchQuery) {
      const newUrl = URLActions.setNewParam("text", spellCheckedSearchQuery);

      const basename = CLIENT_URL;
      if (navigate) navigate(newUrl.replace(basename, ""), { replace: true });
    }
    if (setIsFoundDevicesByQuery) setIsFoundDevicesByQuery(!!devices.length);
  }

  if (setSpellCheckedQuery) {
    if (!!spellCheckedSearchQuery && spellCheckedSearchQuery !== preparedSearchQuery) {
      setSpellCheckedQuery(spellCheckedSearchQuery);
    } else {
      setSpellCheckedQuery(preparedSearchQuery);
    }
  }

  return { devices, spellCheckedSearchQuery };
}

export default getDevicesBySearchQuery;