import { useContext, useState } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import SlimDeviceCombinationInfo from "./SlimDeviceCombinationInfo";

const UserPageOrderExpandedDeviceListItem = observer(({ 
  orderCombo, orderSelectedAdditionalServices, additionalServicesObj 
}) => {
  const { deviceStore } = useContext(Context);

  const [selectedAddServices, setSelectedAddServices] = useState(
    orderSelectedAdditionalServices?.["selected-additional-services"]?.[orderCombo.id] || []
  );

  if (!deviceStore.hasTriedToFetchSales) return <div aria-hidden="true" />;

  return (
    <SlimDeviceCombinationInfo 
      type="user-page"
      orderCombo={orderCombo}
      additionalServicesObj={additionalServicesObj}
      selectedAddServices={selectedAddServices}
      setSelectedAddServices={setSelectedAddServices}
      isReadOnlyAddServices={true}
    />
  );
});

export default UserPageOrderExpandedDeviceListItem;
