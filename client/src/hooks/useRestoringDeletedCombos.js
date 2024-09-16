const { useEffect, useContext } = require("react");
const { Context } = require("../Context");
const { getOneCartDeviceCombinations, createCartDeviceCombination } = require("../http/CartAPI");
const _ = require("lodash");
const { v4 } = require("uuid");
const { getOneStock } = require("../http/StocksAPI");

function useRestoringDeletedCombos(setIsLoadedCombos, setOldCartComboAmounts, setDeletedCartCombos, fetching, prevCartIdRef) {
  const { user } = useContext(Context);

  useEffect(() => {
    async function callback() {
      try {
        setIsLoadedCombos(false);
        const combosInActualCart = await getOneCartDeviceCombinations(user.cart?.id);
        
        let nextOldCartComboAmounts = {};
        let nextDeletedCartCombos = [];

        for (let cartCombo of user.cartDeviceCombinations) {
          const isIncluded = combosInActualCart.find(actualCombo => cartCombo.id === actualCombo.id);
          if (!isIncluded) {
            // possibly restoring cart combo that was deleted from the other browser tab
            // to continue working with it with no errors ahead
            let possiblyRestoredCartCombo = _.cloneDeep(cartCombo);
            possiblyRestoredCartCombo.id = v4();
            // if we are restoring a preOrder cartCombo, don't change amount to the actual maximum one
            // as we do with other ones
            possiblyRestoredCartCombo.amount = cartCombo.device.isPreOrder
              ? cartCombo.amount
              : (await getOneStock(cartCombo["device-combination"].stockId)).totalStock;
            // storing old amount of a cart combo and only

            // using <= just in case
            if (possiblyRestoredCartCombo.amount <= 0) {
              const deletedCartComboObj = {
                "id": v4(),
                "device": cartCombo.device,
                "device-combination": cartCombo["device-combination"]
              };

              nextDeletedCartCombos.push(deletedCartComboObj);
            } else {
              // we have need in recreating the combo only if its available atm
              nextOldCartComboAmounts[possiblyRestoredCartCombo.id] = cartCombo.amount
              await createCartDeviceCombination(possiblyRestoredCartCombo);
            }
          }
        }

        setOldCartComboAmounts(nextOldCartComboAmounts);
        setDeletedCartCombos(nextDeletedCartCombos);

        // synchronyzing our cart with server / localStorage
        await fetching(user.cart?.id, null, true);
      } catch(e) {
        console.log(e.message);
      } finally {
        setIsLoadedCombos(true);
      }
    }

    if (prevCartIdRef.current !== user.cart?.id) callback();
    // eslint-disable-next-line
  }, [user.cart?.id]);
}

export default useRestoringDeletedCombos;