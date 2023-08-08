const { faker } = require("@faker-js/faker");
const { POSSIBLE_DEVICE_ATTRIBUTES } = require("./consts");

module.exports = (deviceId, categorySlug, attributes, attributeNames, attributeValues) => {
  let deviceAttributeNames = [];
  let deviceAttributeValues = {};

  const attrs = POSSIBLE_DEVICE_ATTRIBUTES[categorySlug];
  const hasAttributes = attrs ? faker.datatype.boolean(0.6): false; // 60% chance of having atributes if a device can possibly have them

  if (hasAttributes) {
    for (let [name, values] of Object.entries(attrs)) {
      
      let attrName;
      const existingName = attributeNames.find(item => item.name === name);

      if (existingName) {
        attrName = existingName;
      } else {
        attrName = {
          "id": attributeNames.length + 1,
          "name": name,
        }

        attributeNames.push(attrName);
        deviceAttributeNames.push(name);
      }

      let tempValues = [];

      for (let value of values) {
        let attrValue;
        const existingValue = attributeValues.find(item => item.value === value);

        if (existingValue) {
          attrValue = existingValue;
        } else {
          attrValue = {
            "id": attributeValues.length + 1,
            "value": value,
          }

          attributeValues.push(attrValue);
        }

        tempValues.push(attrValue.value);

        const attr = {
          "id": attributes.length + 1,
          "attribute-nameId": attrName.id,
          "attribute-valueId": attrValue.id,
          "deviceId": deviceId,
        }
        
        attributes.push(attr);

        const toFinish = values.indexOf(attrValue.value) === 0 ? false : faker.datatype.boolean(0.7); // 70% chance to break the loop
        if (toFinish) break;
      }

      deviceAttributeValues[attrName.name] = tempValues;
      // console.log(deviceAttributeValues);

    }
  }

  return {
    deviceAttributeNames,
    deviceAttributeValues,
  };
}