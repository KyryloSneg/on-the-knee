module.exports = function getElemByClass(container, className) {
  const elem = container.getElementsByClassName(className)[0];
  return elem;
}