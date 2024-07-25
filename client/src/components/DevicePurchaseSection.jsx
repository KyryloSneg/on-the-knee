import "./styles/DevicePurchaseSection.css";
import { observer } from "mobx-react-lite";
import DeviceComboActions from "../utils/DeviceComboActions";
import DeviceItemAddToCartBtn from "./DeviceItemAddToCartBtn";
import DeviceItemPrice from "./DeviceItemPrice";
import { useContext } from "react";
import { Context } from "../Context";

const DevicePurchaseSection = observer(({ price, discountPercentage, device, selectedCombo }) => {
  const { deviceStore } = useContext(Context);
  const { isInStock, isPreOrder } = DeviceComboActions.getStockInfo(selectedCombo, deviceStore.stocks);

  return (
    <section className="device-purchase-section">
      <DeviceItemPrice price={price} discountPercentage={discountPercentage} />
      {(isInStock || isPreOrder)
        ? (
          <DeviceItemAddToCartBtn
            combinations={device["device-combinations"]}
            combo={selectedCombo}
            isWithText={true}
            isPreOrder={device.isPreOrder}
          />
        )
        : <strong className="out-of-stock-msg">Out of stock</strong>
      }
    </section>
  );
});

export default DevicePurchaseSection;
