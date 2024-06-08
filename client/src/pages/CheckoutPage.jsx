import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";

const CheckoutPage = () => {
  const { app } = useContext(Context);
  const pageRef = useRef(null);

  useEffect(() => {
    app.setPageRef(pageRef);
  }, [app]);

  return (
    <div>
      CheckoutPage
    </div>
  );
};

export default CheckoutPage;
