import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import UserLocationBtn from "../components/UserLocationBtn";

const MainPage = () => {
  const { app } = useContext(Context);
  const pageRef = useRef(null);

  useEffect(() => {
    app.setPageRef(pageRef);
  }, [app]);

  return (
    <div>
      MainPage
      <UserLocationBtn />
    </div>
  );
};

export default MainPage;
