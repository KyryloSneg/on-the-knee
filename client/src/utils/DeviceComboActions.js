import DeviceSalesActions from "./DeviceSalesActions";
import findMinMaxPrices from "./findMinMaxPrices";
import getDiscountedPrice from "./getDiscountedPrice";

class DeviceComboActions {

  static getColor(combinationString) {
    const attrs = combinationString.split("-");
    const color = attrs.find(attribute => attribute.startsWith("color:"));

    return color;
  }

  // converting to default combination format with attribute's name and value
  // for example: (hz, 60hz, "hz:144-color:purple#a020f0") => "hz:60-color:purple#a020f0"
  static getDefaultComboStrByAttr(name, value, defaultStrFormat) {
    const attrList = defaultStrFormat.split("-");
    const defaultComboStr = attrList.map(attr => {
      if (attr.startsWith(`${name}:`)) {
        return `${name}:${value}`;
      }

      return attr;
    });

    return defaultComboStr.join("-");
  }

  static getDefaultComboAttrHrefs(defaultCombo, combinations, deviceId, stocks, includedAttrs = [], isToHandleStockChecks = true) {
    let hrefs = [];
    // adding double dot to the end of attribute names
    includedAttrs = includedAttrs.map(attr => attr[attr.length - 1] === ":" ? attr : `${attr}:`);

    function getAttrsWithoutAttribute(combination) {
      const attrs = combination.combinationString.split("-");
      let attrsWithoutAttribute = [];

      outerLoop: for (let attr of attrs) {
        for (let excludedAttr of includedAttrs) {
          // if current attr is in includedAttrs array we do not pushing it to the final array
          // (idk how it even works like this)
          if (attr.startsWith(excludedAttr)) continue outerLoop;
        }

        attrsWithoutAttribute.push(attr);
      }

      return attrsWithoutAttribute
    }

    const defaultAttrsWithoutAttribute = getAttrsWithoutAttribute(defaultCombo);

    // using the loop label below to prevent pushing a redundant attribute
    outerLoop: for (let combo of combinations) {
      if (isToHandleStockChecks) {
        const stock = stocks.find(comboStock => comboStock.id === combo.stockId);
        if (stock?.totalStock <= 0) continue;
      }

      const comboAttrs = getAttrsWithoutAttribute(combo);
      if (comboAttrs.length !== defaultAttrsWithoutAttribute.length) continue;

      // if default attrs don't include combo attr we continuing the outer loop
      for (let attr of comboAttrs) {
        if (!defaultAttrsWithoutAttribute.includes(attr)) continue outerLoop;
      }

      // else we push a combo href
      hrefs.push(`${deviceId}/${combo.combinationString}`);
    }

    return hrefs;
  }

  static getComboColorHrefObjects(comboColorHrefs, device, stocks) {
    let comboColorHrefObjects = [];
    if (comboColorHrefs) {
      comboColorHrefObjects = comboColorHrefs.map(href => {
        const comboStr = href.split("/")[1];
        const combination = device["device-combinations"].find(
          combo => combo.combinationString === comboStr
        );

        const stock = stocks.find(stockItem => stockItem.id === combination.stockId);
        const hrefObj = {
          href: href,
          isDisabled: stock.totalStock <= 0,
        };

        return hrefObj
      });
    }

    return comboColorHrefObjects;
  }

  static getAttr(combinationString, attrName) {
    const allAttributes = combinationString.split("-");
    const attribute = allAttributes.find(attr => attr.startsWith(`${attrName}:`));
    const attrValue = attribute.split(":")[1];

    return attrValue;
  }

  static getComboStrFromAttr(value, name, combinationStrings) {
    const comboStr = combinationStrings.find(str => {
      const attrs = str.split("-");
      return attrs.includes(`${name}:${value}`);
    });

    return comboStr;
  }

  static getAttrValuesFromComboStrings(combinationStrings, attrName) {
    let attrs = [];

    for (let comboStr of combinationStrings) {
      const attrValue = this.getAttr(comboStr, attrName);

      if (attrs.includes(attrValue)) continue;
      attrs.push(attrValue)
    }

    return attrs;
  }

  static getAttrNamesWithoutColor(combinationStrings) {
    let attrNames = [];

    for (let comboStr of combinationStrings) {
      const attrs = comboStr.split("-");

      for (let attribute of attrs) {
        const name = attribute.split(":")[0];
        if (name === "color") continue;

        attrNames.push(name);
      }

      return attrNames;
    }
  }

  static getAttributesList(defaultCombination, stocks, device) {
    const combinationStrings = device["device-combinations"].map(devCombo => devCombo.combinationString);
    const attributeNames = this.getAttrNamesWithoutColor(combinationStrings);

    const attributesList = attributeNames.map(name => {

      const attrHrefsInStock = this.getDefaultComboAttrHrefs(
        defaultCombination,
        device["device-combinations"],
        device.id,
        stocks,
        [name],
      );
      
      const attrValues = this.getAttrValuesFromComboStrings(combinationStrings, name);
      const valuesObj = attrValues.map(value => {
        const comboStr = this.getDefaultComboStrByAttr(name, value, defaultCombination.combinationString);
        const href = `${device.id}/${comboStr}`;

        return {
          attrValue: value,
          href: href,
          isDisabled: !attrHrefsInStock.includes(href)
        };
      });

      return {
        name: name,
        valuesObj: valuesObj,
      };
    });

    return attributesList;
  }

  static findDefaultCombination(device, stocks) {
    const defaultCombination = device["device-combinations"].find(combo => combo.default);
    let defaultCombinationInStock = {...defaultCombination};

    function getStock(stockId) {
      return stocks.find(stock => stock.id === stockId);
    }

    // if there are some different combinations
    if (defaultCombination.combinationString) {
      const stock = getStock(defaultCombination.stockId).totalStock;

      // check is default combination not in stock
      if (!stock) {
        // find any combination in stock
        const comboInStock = device["device-combinations"].find(combo => {
          const currentStock = getStock(combo.stockId).totalStock;
          return currentStock > 0;
        });

        // if we found one, assign it's value to our defaultCombination in props
        if (comboInStock) defaultCombinationInStock = comboInStock;
      }

    }

    let isInStock = !!getStock(defaultCombinationInStock.stockId).totalStock;
    return { defaultCombinationInStock, isInStock };
  }

  static getDeviceMinMaxPrices(devices, sales = [], saleTypeNames = []) {
    let prices = [];
  
    for (let dev of devices) {
      const { discountPercentage } = DeviceSalesActions.getSaleTypesAndDiscount(dev, sales, saleTypeNames);
      
      for (let combo of dev["device-combinations"]) {
        let price;
        if (discountPercentage) {
          price = getDiscountedPrice(combo.price, discountPercentage);
        } else {
          price = combo.price;
        }
  
        prices.push(price);
      }
    }
  
    const { minPrice, maxPrice } = findMinMaxPrices(prices);
    return { minPrice, maxPrice };
  }

}

export default DeviceComboActions;