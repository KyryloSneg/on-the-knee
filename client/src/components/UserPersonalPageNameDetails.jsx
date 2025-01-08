import "./styles/UserPersonalPageNameDetails.css";
import UIDetails from "./UI/uiDetails/UIDetails";
import UserPersonalNameDetailsBtnChild from "./UserPersonalNameDetailsBtnChild";
import UserPersonalNameDetailsContentChild from "./UserPersonalNameDetailsContentChild";

const UserPersonalPageNameDetails = () => {
  return (
    <UIDetails 
      btnChildren={<UserPersonalNameDetailsBtnChild />}
      contentChildren={<UserPersonalNameDetailsContentChild />}
      isToPassBtnChildIsExpandedProp={true}
    />
  );
};

export default UserPersonalPageNameDetails;
