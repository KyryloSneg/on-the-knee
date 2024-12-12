module.exports = (device, saleDevices, sales, saleTypes) => {
  const saleDev = saleDevices.find(d => d.deviceId === device.id);
  if (!saleDev) return;

  const sale = sales.find(sale => sale.id === saleDev.saleId);
  const type = saleTypes.find(t => t.saleId === sale.id);

  return { sale, type }
}