import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import useClosingAllWindows from "../hooks/useClosingAllWindows";

const DesiredListPage = () => {
  const { app } = useContext(Context);
  const pageRef = useRef(null);

  useEffect(() => {
    app.setPageRef(pageRef);
  }, [app]);

  useClosingAllWindows();
  return (
    <div>
      DesiredListPage
    </div>
  );
}

export default DesiredListPage;
