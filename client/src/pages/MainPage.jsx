import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import UserLocationBtn from "../components/UserLocationBtn";
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
      {/* <UserLocationBtn /> */}
      <UserLocationBtnNotification />
    </div>
  );
};

export default MainPage;
