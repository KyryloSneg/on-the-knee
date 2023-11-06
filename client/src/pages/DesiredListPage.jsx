import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";

const DesiredListPage = () => {
  const { app } = useContext(Context);
  const pageRef = useRef(null);

  useEffect(() => {
    app.setPageRef(pageRef);
  }, [app]);

  return (
    <div>
      DesiredListPage
    </div>
  );
}

export default DesiredListPage;
