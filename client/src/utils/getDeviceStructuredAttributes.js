import _ from "lodash";
import { getAttributesInfo } from "../http/AttributesAPI";

async function getDeviceStructuredAttributes(isSpecialFilters, devices) {
  let attributes = [];
  if (isSpecialFilters) {

    for (let dev of devices) {
      for (let combination of dev["device-combinations"]) {
        // { combinationString: "phoneStorage:32 GB-color:purple#a020f0" }
        // attrs = [phoneStorage:32 GB, color:purple#a020f0]
        const attrs = combination.combinationString?.split("-");
        if (!attrs) continue;

        for (let attr of attrs) {
          // attr.split(":") = ["phoneStorage", "32 GB"]
          const [name, value] = attr.split(":");
          const structuredAttr = {
            deviceId: dev.id,
            name: name,
            value: value
          };

          const isAlreadyExists = !!attributes.find(attrToCheck => _.isEqual(attrToCheck, structuredAttr));
          if (!isAlreadyExists) attributes.push(structuredAttr);
        }
      }

    }

  } else {
    const deviceIds = devices.map(dev => dev.id);

    const allAttributes = await getAttributesInfo();
    const devicesAttributes = allAttributes.filter(attr => deviceIds.includes(attr.deviceId));

    for (let attr of devicesAttributes) {
      const structuredAttr = {
        deviceId: attr.deviceId,
        name: attr["attribute-name"].name,
        value: attr["attribute-value"].value,
      }

      attributes.push(structuredAttr);
    }
  }

  return attributes;
}

export default getDeviceStructuredAttributes;