import { Context } from "../Context";

const { useEffect, useContext } = require("react");

export default function useSettingInitialDeviceListItemsValues() {
  const { deviceStore, user } = useContext(Context);

  useEffect(() => {
    let initialDeviceListItemsValues = {};
    for (let cartCombo of user.cartDeviceCombinations) {
      
      if (initialDeviceListItemsValues[cartCombo.id]) continue;
      let addServicesTotalPrice = 0;

      const selectedAddServices = user.cartSelectedAdditionalServices["selected-additional-services"];
      if (selectedAddServices && selectedAddServices[cartCombo.id]) {
        for (let selectedItem of selectedAddServices[cartCombo.id]) {
          addServicesTotalPrice += +selectedItem.price;
        }
      }

      initialDeviceListItemsValues[cartCombo.id] = {
        value: cartCombo.amount,
        totalStock: Infinity,
        selectedAddServices: selectedAddServices,
        addServicesTotalPrice: addServicesTotalPrice,
      };
    }

    deviceStore.setDeviceListItemsValues(initialDeviceListItemsValues);
  }, [deviceStore, user.cartDeviceCombinations, user.cartSelectedAdditionalServices]);
}