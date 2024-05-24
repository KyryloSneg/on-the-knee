import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import setSelectUserLocationVisibility from "../utils/setSelectUserLocationModalVisibility";

const MainPage = () => {
  const { app } = useContext(Context);
  const pageRef = useRef(null);

  useEffect(() => {
    app.setPageRef(pageRef);
  }, [app]);

  return (
    <div>
      MainPage
      <button onClick={() => setSelectUserLocationVisibility(true, app)}>
        Open user location modal
      </button>
    </div>
  );
};

export default MainPage;
