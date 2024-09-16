import "./styles/WrongCartComboAmountsModal.css";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../Context";
import ModalWindow from "./UI/modalWindow/ModalWindow";
import { observer } from "mobx-react-lite";
import setWrongCartComboAmountsModalVisibility from "../utils/setWrongCartComboAmountsVisibility";
import WrongCartComboAmountsModalContent from "./WrongCartComboAmountsModalContent";
import useGettingCartData from "../hooks/useGettingCartData";
import useRestoringDeletedCombos from "../hooks/useRestoringDeletedCombos";
import useSettingInitialDeviceListItemsValues from "../hooks/useSettingInitialDeviceListItemsValues";
import useUpdatingCartDataOnModalClose from "../hooks/useUpdatingCartDataOnModalClose";

const WrongCartComboAmountsModal = observer(() => {
  const { app, user } = useContext(Context);
  const fetching = useGettingCartData(null, null, true, false);
  const [isLoadedCombos, setIsLoadedCombos] = useState(false);
  const [oldCartComboAmounts, setOldCartComboAmounts] = useState({});
  const [deletedCartCombos, setDeletedCartCombos] = useState([]);
  const prevCartId = useRef(null);

  function setIsCartComboAmountsModalVisible(isVisible) {
    setWrongCartComboAmountsModalVisibility(isVisible, app);
  }

  useRestoringDeletedCombos(setIsLoadedCombos, setOldCartComboAmounts, setDeletedCartCombos, fetching, prevCartId);

  // using the same effect as the cart modal one because user
  // can open checkout page from url without opening the cart modal
  // and then we won't have deviceListItemsValues state's value that we need
  useSettingInitialDeviceListItemsValues();

  // before closing the modal update combos' amount and selected additional services
  useUpdatingCartDataOnModalClose("wrongCartComboAmounts");
  useEffect(() => {
    prevCartId.current = user.cart?.id;
  });

  return (
    <ModalWindow
      isVisible={app.isVisibleWrongCartComboAmountsModal}
      setIsVisible={setIsCartComboAmountsModalVisible}
      children={
        <WrongCartComboAmountsModalContent 
          closeModal={() => setIsCartComboAmountsModalVisible(false)} 
          isLoadedCombos={isLoadedCombos} 
          oldCartComboAmounts={oldCartComboAmounts}
          deletedCartCombos={deletedCartCombos}
        />
      }
      headerText="Device amount has been changed"
      id="cart-combo-amounts-modal"
      triggerElemRef={app.checkoutSubmitBtnRef}
    />
  );
});

export default WrongCartComboAmountsModal;