export default function getUserOrderDeviceCombinations(orders) {
  let result = [];
  
  
  for (let order of orders) {
    const oneOrderDevCombos = order?.["order-device-combinations"]?.map(orderCombo => {
      return orderCombo?.["device-combination"];
    }) || [];

    if (Array.isArray(oneOrderDevCombos)) {
      for (let orderDevCombo of oneOrderDevCombos) {
        const doesAlreadyExist = result.find(orderCombo => orderCombo.id === orderDevCombo.id);
        if (!doesAlreadyExist) result.push(orderDevCombo);
      }
    }
  };

  return result;
}