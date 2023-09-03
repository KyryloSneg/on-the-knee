import { useOutletContext } from "react-router-dom";

const CheckoutPage = () => {
  // temporary ignoring linter
  // eslint-disable-next-line
  const { pageRef } = useOutletContext();

  return (
    <div>
      CheckoutPage
    </div>
  );
};

export default CheckoutPage;
