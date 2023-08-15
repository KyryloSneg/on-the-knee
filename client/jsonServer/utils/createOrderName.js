module.exports = (orderId, deviceNames) => {
  const firstPart = `${orderId}`;
  let secondPart = deviceNames.map(name => name[0]).join("");

  const result  = (`${firstPart}-${secondPart}`).toUpperCase();
  return result
}