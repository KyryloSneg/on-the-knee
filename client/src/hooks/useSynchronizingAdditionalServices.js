import _ from "lodash";

const { useEffect, useContext } = require("react");
const { Context } = require("../Context");

// combination is a cart combination
function useSynchronizingAdditionalServices(setSelectedAddServices, combinationId) {
  const { user } = useContext(Context);

  // synchronizing local selected add. services state with the global one 
  // (useful if we've changed add. services in cart while, for instance, 
  // checkout page with add. services is opened)
  useEffect(() => {
    if (combinationId !== undefined && combinationId !== null) {
      setSelectedAddServices((argSelectedAddServices) => {
        let nextValue = argSelectedAddServices;
        // adding the first condition to make sure it's not undefined
        if (
          !!user.cartSelectedAdditionalServices["selected-additional-services"][combinationId] 
          && !_.isEqual(
            argSelectedAddServices, 
            user.cartSelectedAdditionalServices["selected-additional-services"][combinationId]
          )
        ) {
          nextValue = user.cartSelectedAdditionalServices["selected-additional-services"][combinationId];
        }
  
        return nextValue
      });
    }
  }, [setSelectedAddServices, user.cartSelectedAdditionalServices, combinationId]);
}

export default useSynchronizingAdditionalServices;