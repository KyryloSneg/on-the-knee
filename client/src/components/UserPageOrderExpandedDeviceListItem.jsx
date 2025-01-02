import { useState } from "react";
import SlimDeviceCombinationInfo from "./SlimDeviceCombinationInfo";

const UserPageOrderExpandedDeviceListItem = ({ 
  orderCombo, orderSelectedAdditionalServices, additionalServicesObj 
}) => {
  const [selectedAddServices, setSelectedAddServices] = useState(
    orderSelectedAdditionalServices?.["selected-additional-services"]?.[orderCombo.id] || []
  );

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
};

export default UserPageOrderExpandedDeviceListItem;
