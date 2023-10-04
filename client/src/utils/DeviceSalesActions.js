class DeviceSalesActions {

  static getSaleTypesAndDiscount(device, sales, saleTypeNames) {
    let deviceSaleTypes = [];
    let discountPercentage;

    // if our device is promotional
    if (!!device["sale-devices"]?.length) {

      // we iterate through the sales it has
      for (let sale of device["sale-devices"]) {
        // find our sale
        const deviceSale = sales.find(s => s.id === sale.saleId);
        for (let type of deviceSale["sale-types"]) {
          // searching for type's name
          const name = saleTypeNames.find(typeName => typeName.id === type.saleTypeNameId).name;

          // and pushing sale types to the deviceSaleTypes array
          // they have fields such a sale icon and discount percentage
          deviceSaleTypes.push({ ...type, "name": name });
        }
      }

      discountPercentage =
        deviceSaleTypes.find(type => type.discountPercentage > 0)?.discountPercentage || null;
    }

    return { deviceSaleTypes, discountPercentage };
  }

}

export default DeviceSalesActions;