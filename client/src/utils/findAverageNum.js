module.exports = (array) => {
  if (!array.length) return 0;

  const sum = array.reduce((accumulator, current) => accumulator + current);
  const avgNum = (sum / array.length).toFixed(1);

  return avgNum;
}