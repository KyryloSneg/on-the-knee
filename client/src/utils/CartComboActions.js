import { TO_LIFT_ON_THE_FLOOR_PRICE } from "./consts";
import DeviceSalesActions from "./DeviceSalesActions";
import { getDiscountedPrice } from "./getDiscountedPrice";

export default class CartComboActions {

  static getDeviceAmountAndTotalPrice(cartDeviceCombinations, sales, saleTypeNames, hasTriedToFetchSales) {
    let deviceAmount = 0;
    let devicePrice = 0;

    for (let cartCombo of cartDeviceCombinations) {
      if (cartCombo?.amount) {
        deviceAmount += +cartCombo.amount;

        if (cartCombo?.["device-combination"]?.price) {
          if (!hasTriedToFetchSales) {
            return { deviceAmount: 0, devicePrice: 0 };
          }

          let { discountPercentage } = DeviceSalesActions.getSaleTypesAndDiscount(
            cartCombo.device, sales, saleTypeNames, hasTriedToFetchSales
          );
        
          if (discountPercentage === undefined) {
            discountPercentage = 0;
          };
        
          devicePrice += getDiscountedPrice(cartCombo["device-combination"].price, discountPercentage) * +cartCombo.amount;
        }
      }
    }

    return { deviceAmount, devicePrice };
  }

  static getDeliveryTotalPrice(orders, selectedDeliveryIdValues, deliveries, isToLiftOnTheFloorValues) {
    let deliveryPrice = 0;

    for (let [id, order] of Object.entries(orders)) {
      const selectedDeliveryIdValue = selectedDeliveryIdValues?.[id];
      const selectedDelivery = deliveries?.find(delivery => delivery?.id === selectedDeliveryIdValue?.value);

      if (selectedDelivery?.name === "courier") {
        deliveryPrice += isToLiftOnTheFloorValues?.[id]?.value ? TO_LIFT_ON_THE_FLOOR_PRICE : 0;
      }

      // some orders can contain only the cart combos with free delivery
      if (!order.isFreeDelivery) {
        deliveryPrice += +selectedDelivery?.price || 0;
      }
    }

    return deliveryPrice;
  }

}