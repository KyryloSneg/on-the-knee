import "./styles/DeliverySectionSelfDeliveryOption.css";
import SelfDeliveryBtn from "./SelfDeliveryBtn";
import Dropdown from "./UI/dropdown/Dropdown";
import { useCallback, useContext, useMemo } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";

const DeliverySectionSelfDeliveryOption = observer(() => {
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

  // using useCallback and useMemos to fell free using it in the dropdown's
  // useInitialDropdownValue hook
  const onSelectCb = useCallback((index) => {
    const nextId = options[index]?.value?.id;
    if (nextId) app.setSelectedStorePickupPointId(nextId);
  }, [app, options]);

  const propsSelectedId = options.find(option => option.value?.id === app.selectedStorePickupPointId)?.id || 0;

  return (
    <div className="delivery-section-self-delivery-option">
      <Dropdown
        options={options}
        placeHolder="Select pickup point"
        propsSelectedId={propsSelectedId}
        onSelectCb={onSelectCb}
      />
      <SelfDeliveryBtn placeholder="Select on the map" />
    </div>
  );
});

export default DeliverySectionSelfDeliveryOption;
