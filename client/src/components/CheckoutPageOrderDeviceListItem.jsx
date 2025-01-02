import { useContext, useRef, useState } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import useGettingAddServicesRelatedData from "../hooks/useGettingAddServicesRelatedData";
import useSynchronizingAdditionalServices from "../hooks/useSynchronizingAdditionalServices";
import useChangingServerAddServicesOnChange from "../hooks/useChangingServerAddServicesOnChange";
import SlimDeviceCombinationInfo from "./SlimDeviceCombinationInfo";

const CheckoutPageOrderDeviceListItem = observer(({ combination, cartDataFetching }) => {
  const { deviceStore, user } = useContext(Context);
  const isInitialRender = useRef(true);

  let initSelectedItems = [];
  if (user.cartSelectedAdditionalServices["selected-additional-services"]) {
    initSelectedItems = user.cartSelectedAdditionalServices["selected-additional-services"][combination.id] || [];
  }

  const [selectedAddServices, setSelectedAddServices] = useState(initSelectedItems);
  const [additionalServicesObj, setAdditionalServicesObj] = useState([]);

  useSynchronizingAdditionalServices(setSelectedAddServices, combination?.id);
  useChangingServerAddServicesOnChange(selectedAddServices, combination?.id, cartDataFetching, isInitialRender);
  
  useGettingAddServicesRelatedData(combination.device, setAdditionalServicesObj);

  if (!deviceStore.hasTriedToFetchSales) return;
  if (isInitialRender.current) isInitialRender.current = false;

  return (
    <SlimDeviceCombinationInfo 
      type="checkout-page"
      orderCombo={combination}
      additionalServicesObj={additionalServicesObj}
      selectedAddServices={selectedAddServices}
      setSelectedAddServices={setSelectedAddServices}
    />
  );
});

export default CheckoutPageOrderDeviceListItem;
