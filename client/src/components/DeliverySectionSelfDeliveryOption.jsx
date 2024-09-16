import "./styles/DeliverySectionSelfDeliveryOption.css";
import SelfDeliveryBtn from "./SelfDeliveryBtn";
import Dropdown from "./UI/dropdown/Dropdown";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";

const DeliverySectionSelfDeliveryOption = observer(({ 
  orderId, setIsDirty, selectedStorePickupPointId, setSelectedStorePickupPointId 
}) => {
  const { app } = useContext(Context);

  const storePickupPoints = useMemo(
    () => app.storePickupPoints?.filter(point => point.cityId === app.userLocation?.id),
    [app.storePickupPoints, app.userLocation?.id]
  );
  
  const options = useMemo(() => storePickupPoints?.map((point, index) => ({
    id: index,
    title: point.fullName,
    value: point
  })) || [],
    [storePickupPoints]
  );

  // using useCallback and useMemos to feel free using it in the dropdown's
  // useInitialDropdownValue hook
  const onSelectCb = useCallback((index) => {
    const nextId = options[index]?.value?.id;
    if (nextId) setSelectedStorePickupPointId(nextId);

    setIsDirty(true);
  }, [options, setSelectedStorePickupPointId, setIsDirty]);

  useEffect(() => {
    const initialValue = options[0]?.value?.id;
    if (initialValue) setSelectedStorePickupPointId(initialValue);
  }, [options, setSelectedStorePickupPointId]);

  const propsSelectedId = options.find(option => option.value?.id === selectedStorePickupPointId)?.id || 0;

  return (
    <div className="delivery-section-self-delivery-option">
      <Dropdown
        options={options}
        placeHolder="Select pickup point"
        propsSelectedId={propsSelectedId}
        onSelectCb={onSelectCb}
      />
      <SelfDeliveryBtn 
        type="checkout-page"
        placeholder="Select on the map" 
        selfDeliveryModalSelectedPointValueId={orderId} 
        onModalOptionSelectCb={() => setIsDirty(true)}
      />
    </div>
  );
});

export default DeliverySectionSelfDeliveryOption;
