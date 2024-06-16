import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import UserLocationBtnNotification from "../components/UserLocationBtnNotification";

const MainPage = () => {
  const { app } = useContext(Context);
  const pageRef = useRef(null);

  useEffect(() => {
    app.setPageRef(pageRef);
  }, [app]);

  return (
    <div>
      MainPage
      <UserLocationBtnNotification />
    </div>
  );
};

export default MainPage;
