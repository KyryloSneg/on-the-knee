import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";

const UserPage = () => {
  const { app } = useContext(Context);
  const pageRef = useRef(null);

  useEffect(() => {
    app.setPageRef(pageRef);
  }, [app]);

  return (
    <div>
      UserPage
    </div>
  );
};

export default UserPage;
