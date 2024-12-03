import { patchCartSelectedAdditionalServices } from "http/CartAPI";
import _ from "lodash";

/** 
  * @param {Object} cartSelectedAdditionalServices
  * @param {Object[]} newSelectedAddServices
  * @param {string | number} combinationId
  * @param {boolean} isAuth
  * @param {Object} options
  * @param {boolean} [options.isWithFetch=true] - is to update cart data in the store
  * @param {function() | null} [options.cartDataFetching=null] - gettingCartData fetching (define it if options.isWithFetch === true) 
  */
export default async function updateServerCartSelectedAddServices(
  cartSelectedAdditionalServices, newSelectedAddServices, combinationId, isAuth, 
  options = { isWithFetch: false, cartDataFetching: null }
) {
  let newCartSelectedAdditionalServices = _.cloneDeep(cartSelectedAdditionalServices);
  newCartSelectedAdditionalServices["selected-additional-services"][combinationId] = newSelectedAddServices;

  if (isAuth) {
    if (newCartSelectedAdditionalServices?.id) {
      await patchCartSelectedAdditionalServices(
        newCartSelectedAdditionalServices.id,
        { "selected-additional-services": newCartSelectedAdditionalServices["selected-additional-services"] }
      );
      
      if (options.isWithFetch) await options.cartDataFetching();
    }
  } else {
    localStorage.setItem("cartSelectedAddServices", JSON.stringify(newCartSelectedAdditionalServices));
    if (options.isWithFetch) await options.cartDataFetching();
  }
}