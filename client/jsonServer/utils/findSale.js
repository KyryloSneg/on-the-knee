module.exports = (device, saleDevices, sales, saleTypes) => {
  const saleDev = saleDevices.find(d => d.deviceId === device.id);
  if (!saleDev) return;

  const sale = sales[saleDev.saleId - 1];
  const type = saleTypes.find(t => t.saleId === sale.id);

  return { sale, type }
}