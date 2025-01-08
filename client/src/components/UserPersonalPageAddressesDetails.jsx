import UIDetails from "./UI/uiDetails/UIDetails";
import UserPersonalAddressesBtnChild from "./UserPersonalAddressesBtnChild";
import UserPersonalAddressesContentChild from "./UserPersonalAddressesContentChild";

const UserPersonalPageAddressesDetails = () => {
  return (
    <UIDetails 
      btnChildren={<UserPersonalAddressesBtnChild />}
      contentChildren={<UserPersonalAddressesContentChild />}
      isToPassBtnChildIsExpandedProp={true}
    />
  );
};

export default UserPersonalPageAddressesDetails;
