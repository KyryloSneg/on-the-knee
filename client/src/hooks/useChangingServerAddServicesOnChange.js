import _ from "lodash";
import { patchCartSelectedAdditionalServices } from "../http/CartAPI";
import useLodashDebounce from "./useLodashDebounce";
import useLoadingSyncWithGlobalLoading from "./useLoadingSyncWithGlobalLoading";
import useIsGlobalLoadingSetter from "./useIsGlobalLoadingSetter";

const { useEffect, useContext, useState } = require("react");
const { Context } = require("../Context");

// cartDataFetching fn is a function that invoke useGettingCartData's fetching with already defined args.

// Example:
// function cartDataFetching() {
//   fetching(user.cart?.id, null, true);
// } 

// combination is a cart combination
function useChangingServerAddServicesOnChange(selectedAddServices, combinationId, cartDataFetching, isInitialRenderRef) {
  const { user } = useContext(Context);

  const [isLoading, setIsLoading] = useState(false);
  const isGlobalLoadingSetter = useIsGlobalLoadingSetter();

  // updating .cartSelectedAdditionalServices on selectedAddServices change
  async function callback() {
    try {
      if (Object.keys(user.cartSelectedAdditionalServices)?.length) {
        if (Object.keys(user.cartSelectedAdditionalServices["selected-additional-services"])?.length) {
          if (!_.isEqual(
            selectedAddServices, user.cartSelectedAdditionalServices["selected-additional-services"]?.[combinationId]
          )) {
            setIsLoading(true);

            let newCartSelectedAdditionalServices = _.cloneDeep(user.cartSelectedAdditionalServices);
            newCartSelectedAdditionalServices["selected-additional-services"][combinationId] = selectedAddServices;

            if (user.isAuth) {
              if (newCartSelectedAdditionalServices?.id) {
                await patchCartSelectedAdditionalServices(
                  newCartSelectedAdditionalServices.id,
                  { "selected-additional-services": newCartSelectedAdditionalServices["selected-additional-services"] }
                );
                await cartDataFetching();
              }
            } else {
              localStorage.setItem("cartSelectedAddServices", JSON.stringify(newCartSelectedAdditionalServices));
              await cartDataFetching();
            }
          }
        }
      }
    } catch (e) {
      console.log(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  // making the life of our server a bit better (and controls of add. services section are usable now)
  const debouncedCallback = useLodashDebounce(callback, 500);
  useEffect(() => {
    if (!isInitialRenderRef.current && (combinationId !== undefined && combinationId !== null)) debouncedCallback();
    // eslint-disable-next-line
  }, [selectedAddServices, user.isAuth]);

  // using global loading to prevent some unexpected behaviour if user clicks during cb execution
  useLoadingSyncWithGlobalLoading(isLoading, isGlobalLoadingSetter);
}

export default useChangingServerAddServicesOnChange;