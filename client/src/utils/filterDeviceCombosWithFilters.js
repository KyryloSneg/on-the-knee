function filterDeviceCombosWithFilters(filterFn, array) {
  const filteredDevices = array.filter(dev => {
    // passing dev in the filterFn below to get access to it (like in filtering by price)
    const filteredCombos = dev["device-combinations"].filter((combo) => filterFn(combo, dev));
    // if device has no combos we don't push it to the filteredDevices array
    if (!filteredCombos.length) return false;

    const defaultCombo = filteredCombos.find(combo => combo.default);
    if (!defaultCombo?.length) {
      // setting a default combo (some random combination that left after the filtration)
      filteredCombos[0].default = true;
    }

    dev["device-combinations"] = filteredCombos;
    return true;
  });

  return filteredDevices;
}

export default filterDeviceCombosWithFilters;