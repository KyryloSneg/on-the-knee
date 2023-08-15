const { faker } = require("@faker-js/faker")

module.exports = (sales, devices) => {
  let saleDevices = [];

  // for (let dev of devices) {
  //   const hasSale = faker.datatype.boolean(0.3);
  //   if (!hasSale) continue;

  //   const sale = sales[faker.number.int({ min: 0, max: sales.length - 1 })];
  //   const saleDevice = {
  //     "id": saleDevices.length + 1,
  //     "saleId": sale.id,
  //     "deviceId": dev.id,
  //   }

  //   saleDevices.push(saleDevice);
  // }

  for (let sale of sales) {
    const promotionalDeviceAmount = faker.number.int({ min: 1, max: 5 });
    const deviceStart = faker.number.int({ min: 0, max: devices.length - promotionalDeviceAmount });

    for (let dev of devices.slice(deviceStart, deviceStart + promotionalDeviceAmount + 1)) {
      const saleDevice = {
        "id": saleDevices.length + 1,
        "saleId": sale.id,
        "deviceId": dev.id,
      }

      saleDevices.push(saleDevice);
    };
  }

  return saleDevices;
}