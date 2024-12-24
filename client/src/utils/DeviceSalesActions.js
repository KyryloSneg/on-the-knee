class DeviceSalesActions {

  static getSaleTypesAndDiscount(device, sales, saleTypeNames, hasTriedToFetchSales) {
    let deviceSaleTypes = [];
    let discountPercentage = 0;

    if (!hasTriedToFetchSales) return; 
    // if our device is promotional
    if (!!device["sale-devices"]?.length) {

      // we iterate through its sales
      for (let sale of device["sale-devices"]) {
        // find our sale
        const deviceSale = sales?.find(s => s.id === sale.saleId);
        if (deviceSale) {
          for (let type of deviceSale["sale-types"]) {
            // searching for type's name
            const name = saleTypeNames?.find(typeName => typeName.id === type["sale-type-nameId"])?.name;
            if (name) {
              let existingSaleType = deviceSaleTypes.find(saleType => saleType["sale-type-nameId"] === type["sale-type-nameId"]);

              if (existingSaleType) {
                const existingTypeTimestamp = Date.parse(existingSaleType.createdAt);
                const currentTypeTimestamp = Date.parse(type.createdAt);
    
                // if a type in the loop is newer than existing one override last one with it 
                if (currentTypeTimestamp > existingTypeTimestamp) {
                  existingSaleType = { ...type, "name": name, "createdAt": deviceSale.createdAt };
                }
              } else {
                // and pushing sale types to the deviceSaleTypes array
                // they have fields such a sale icon and discount percentage
    
                // creating "createdAt" field to handle multiple sale types of the same type name
                // for example, multiple discount percentages (old one overrides with new one)
                deviceSaleTypes.push({ ...type, "name": name, "createdAt": deviceSale.createdAt });
              }
            }
          }
        }
      }

      discountPercentage =
        deviceSaleTypes.find(type => type.discountPercentage > 0)?.discountPercentage || null;
    }

    return { deviceSaleTypes, discountPercentage };
  }

}

export default DeviceSalesActions;