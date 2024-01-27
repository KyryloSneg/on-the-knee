import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import useClosingAllWindows from "../hooks/useClosingAllWindows";

const MainPage = () => {
  const { app } = useContext(Context);
  const pageRef = useRef(null);

  useEffect(() => {
    app.setPageRef(pageRef);
  }, [app]);

  useClosingAllWindows();
  return (
    <div>
      MainPage
    </div>
  );
};

export default MainPage;
