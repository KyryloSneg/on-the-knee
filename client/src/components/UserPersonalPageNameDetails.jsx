import "./styles/UserPersonalPageNameDetails.css";
import { useMemo } from 'react';
import UIDetails from "./UI/uiDetails/UIDetails";
import { v4 } from "uuid";
import UserPersonalNameDetailsBtnChild from "./UserPersonalNameDetailsBtnChild";
import UserPersonalNameDetailsContentChild from "./UserPersonalNameDetailsContentChild";

const UserPersonalPageNameDetails = () => {
  const expandedContentId = useMemo(() => v4(), []);

  return (
    <UIDetails 
      btnChildren={<UserPersonalNameDetailsBtnChild />}
      contentChildren={<UserPersonalNameDetailsContentChild id={expandedContentId} />}
      contentId={expandedContentId}
      isToPassBtnChildIsExpandedProp={true}
    />
  );
};

export default UserPersonalPageNameDetails;
