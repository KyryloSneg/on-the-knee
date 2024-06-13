import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import UserLocationBtnNotification from "../components/UserLocationBtnNotification";
import setSelfDeliveryModalVisibility from "../utils/setSelfDeliveryModalVisibility";

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
      <button onClick={() => setSelfDeliveryModalVisibility(true, app)}>
        Open self delivery modal
      </button>
    </div>
  );
};

export default MainPage;
