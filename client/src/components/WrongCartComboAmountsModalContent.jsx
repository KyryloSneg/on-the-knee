import "./styles/WrongCartComboAmountsModalContent.css";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../Context";
import UIButton from "./UI/uiButton/UIButton";
import CartModalDeviceList from "./CartModalDeviceList";
import Loader from "./UI/loader/Loader";
import WrongCartComboAmountsDeletedList from "./WrongCartComboAmountsDeletedList";

const WrongCartComboAmountsModalContent = observer(({ closeModal, isLoadedCombos, oldCartComboAmounts, deletedCartCombos }) => {
  const { user } = useContext(Context);

  return (
    <div className="wrong-cart-combo-amounts-modal-content" key="wrong-cart-combo-amounts-modal-content">
      {(user.cartDeviceCombinations?.length && isLoadedCombos)
        ? (
          <>
            {!!Object.keys(oldCartComboAmounts)?.length && (
              <section className="wrong-cart-combo-amounts-changes-section">
                <header>
                  <h3>Changed amount{Object.keys(oldCartComboAmounts)?.length > 1 ? "s" : ""}</h3>
                </header>
                <CartModalDeviceList
                  type="wrongCartComboAmounts"
                  oldCartComboAmounts={oldCartComboAmounts}
                  deletedCartCombos={deletedCartCombos}
                />
              </section>
            )}
            {!!deletedCartCombos?.length && (
              <section className="wrong-cart-combo-amounts-deletion-section">
                <header>
                  <h3>Deleted device{deletedCartCombos?.length > 1 ? "s" : ""}</h3>
                </header>
                <WrongCartComboAmountsDeletedList deletedCartCombos={deletedCartCombos} />
              </section>
            )}
          </>
        ) : <Loader />
      }
      <div className="wrong-cart-combo-amounts-btn-wrap">
        <UIButton
          variant="modal-submit"
          onClick={closeModal}
        >
          Close
        </UIButton>
      </div>
    </div>
  );
});

export default WrongCartComboAmountsModalContent;
