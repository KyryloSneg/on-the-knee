import { useMemo } from "react";
import { v4 } from "uuid";
import UIDetails from "./UI/uiDetails/UIDetails";
import UserPersonalAddressesBtnChild from "./UserPersonalAddressesBtnChild";
import UserPersonalAddressesContentChild from "./UserPersonalAddressesContentChild";

const UserPersonalPageAddressesDetails = () => {
  const expandedContentId = useMemo(() => v4(), []);

  return (
    <UIDetails 
      btnChildren={<UserPersonalAddressesBtnChild />}
      contentChildren={<UserPersonalAddressesContentChild id={expandedContentId} />}
      contentId={expandedContentId}
      isToPassBtnChildIsExpandedProp={true}
    />
  );
};

export default UserPersonalPageAddressesDetails;
