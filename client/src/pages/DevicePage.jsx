import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";

const DevicePage = () => {
  const { app } = useContext(Context);
  const pageRef = useRef(null);

  useEffect(() => {
    app.setPageRef(pageRef);
  }, [app]);

  return (
    <div>
      DevicePage
    </div>
  );
};

export default DevicePage;
