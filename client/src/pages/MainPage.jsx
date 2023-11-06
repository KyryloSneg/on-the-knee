import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";

const MainPage = () => {
  const { app } = useContext(Context);
  const pageRef = useRef(null);

  useEffect(() => {
    app.setPageRef(pageRef);
  }, [app]);

  return (
    <div>
      MainPage
    </div>
  );
};

export default MainPage;
