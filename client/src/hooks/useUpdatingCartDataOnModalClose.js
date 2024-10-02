const { useLayoutEffect, useContext } = require("react");
const { default: useGettingCartData } = require("./useGettingCartData");
const { default: updateCartData } = require("../utils/updateCartData");
const { Context } = require("../Context");

const POSSIBLE_TYPES = ["cart", "wrongCartComboAmounts"];
export default function useUpdatingCartDataOnModalClose(type) {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of useUpdatingCartDataOnModalClose is incorrect")

  const { app, user } = useContext(Context);
  const fetching = useGettingCartData(null, null, true, false);

  // before closing the modal 
  // update combos' amount and selected additional services
  useLayoutEffect(() => {
    return async () => {
      let isVisible = true;
      if (type === "cart") {
        isVisible = app.isVisibleCartModal;
      } else {
        isVisible = app.isVisibleWrongCartComboAmountsModal;
      }

      // we have need in cleanup function on modal closing only
      if (isVisible) return;
      await updateCartData(user, fetching, true);
    }
    // eslint-disable-next-line 
  }, [user.cart?.id]);
}