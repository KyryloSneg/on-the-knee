import { getDevices } from "../http/DeviceApi";
import spellCheck from "../http/SaplingAPI";
import URLActions from "./URLActions";

// using this function in two cases: to get devices or check will a search query return empty catalog page or no (by checking devices amount)
async function getDevicesBySearchQuery(fetchStringQueryParams, additionalCondition = true, setIsFoundDevicesByQuery = null, setSpellCheckedQuery = null, navigate = null, argDevices = []) {
  const searchQuery = URLActions.getParamValue("text");

  // maybe redundant part, but it can help if i'll want to filter existing devices with this function
  let devices = [];
  if (argDevices.length) {
    devices = argDevices;
  } else {
    devices = (await getDevices(fetchStringQueryParams)).devices;
  }

  let spellCheckedSearchQuery = searchQuery;
  if (!devices.length && additionalCondition && searchQuery) {
    spellCheckedSearchQuery = await spellCheck(searchQuery);

    const fetchParams = fetchStringQueryParams.split("&");
    fetchParams[2] = `name_like=${spellCheckedSearchQuery}`.replaceAll(`"`, "");

    fetchStringQueryParams = fetchParams.join("&");
    devices = (await getDevices(fetchStringQueryParams)).devices || [];
  }

  if (additionalCondition) {
    if (!devices.length) {
      devices = (await getDevices()).devices;
      // it looks ugly as hell
      // device found by its combination's sku or deviceCode
      let foundDevice = devices.find(dev =>
        !!dev["device-combinations"].find(combo => combo.sku === searchQuery || combo.deviceCode === +searchQuery)
      ) || null;

      if (foundDevice) {
        const combination = foundDevice["device-combinations"]
          .find(combo => combo.sku === searchQuery || combo.deviceCode === +searchQuery);
        combination.default = true;
        foundDevice["device-combinations"] = [combination];
      }

      devices = foundDevice ? [foundDevice] : [];
    }

    if (devices.length && !!spellCheckedSearchQuery && spellCheckedSearchQuery !== searchQuery) {
      const newUrl = URLActions.setNewParam("text", spellCheckedSearchQuery);

      const basename = process.env.REACT_APP_CLIENT_URL;
      if (navigate) navigate(newUrl.replace(basename, ""), { replace: true });
    }
    if (setIsFoundDevicesByQuery) setIsFoundDevicesByQuery(!!devices.length);
  }

  if (setSpellCheckedQuery) {
    if (!!spellCheckedSearchQuery && spellCheckedSearchQuery !== searchQuery) {
      setSpellCheckedQuery(spellCheckedSearchQuery);
    } else {
      setSpellCheckedQuery(searchQuery);
    }
  }

  return devices;
}

export default getDevicesBySearchQuery;