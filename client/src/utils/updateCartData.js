import _ from "lodash";
import { patchCartDeviceCombination, patchCartSelectedAdditionalServices } from "../http/CartAPI";
import LocalStorageActions from "./LocalStorageActions";

async function updateCartData(user, fetching, isToUpdateAddServices = true) {
  const deviceListItems = Array.from(document.querySelectorAll(".cart-modal-device-list-item"));
  let storageCartCombos = LocalStorageActions.getItem("cartDeviceCombinations") || [];
  let cartSelectedAddServicesObj = {};

  try {
    for (let listItem of deviceListItems) {
      // awaiting just in case of theoretically opened cart right after closing it
      const newAmount = +listItem.dataset.amount;
      const totalStock = +listItem.dataset.totalstock;

      // if amount is greater than available total stock of device,
      // set total stock as the new amount
      if (user.isAuth) {
        await patchCartDeviceCombination(
          listItem.dataset.comboid,
          { amount: newAmount > totalStock ? totalStock : newAmount }
        );
      } else {
        let storageCombo = storageCartCombos.find(combo => combo.id === listItem.dataset.comboid);
        storageCombo.amount = newAmount > totalStock ? totalStock : newAmount;
      }

      if (isToUpdateAddServices) {
        cartSelectedAddServicesObj[listItem.dataset.comboid] = JSON.parse(listItem.dataset.selectedaddservices);
      }
    };

    // updating cart device combinations
    if (isToUpdateAddServices) {
      if (user.isAuth) {
        try {
          if (!_.isEqual(
            user.cartSelectedAdditionalServices["selected-additional-services"],
            cartSelectedAddServicesObj
          )) {
            await patchCartSelectedAdditionalServices(
              user.cartSelectedAdditionalServices.id,
              { "selected-additional-services": cartSelectedAddServicesObj }
            );
          }
        } catch (e) {
          console.log(e.message);
        }
      } else {
        const storageSelectedAddServices = {
          "id": null,
          "cartId": null,
          "selected-additional-services": cartSelectedAddServicesObj,
        };
  
        localStorage.setItem("cartDeviceCombinations", JSON.stringify(storageCartCombos));
        localStorage.setItem("cartSelectedAddServices", JSON.stringify(storageSelectedAddServices));
      }
    }

    await fetching(user.cart?.id, null, true);
  } catch (e) {
    console.log(e.message);
  }
}

export default updateCartData;