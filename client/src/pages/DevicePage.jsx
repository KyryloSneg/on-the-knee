import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import useClosingAllWindows from "../hooks/useClosingAllWindows";

const DevicePage = () => {
  const { app } = useContext(Context);
  const pageRef = useRef(null);

  useEffect(() => {
    app.setPageRef(pageRef);
  }, [app]);

  useClosingAllWindows();
  return (
    <div>
      DevicePage
    </div>
  );
};

export default DevicePage;
