export default function getUserOrderDeviceCombinations(orders) {
  let result = [];

  for (let order of orders) {
    const oneOrderDevCombos = order?.["order-device-combinations"]?.map(orderCombo => {
      return orderCombo?.["device-combination"];
    }) || [];

    if (Array.isArray(oneOrderDevCombos)) result = result.concat(oneOrderDevCombos);
  };

  return result;
}