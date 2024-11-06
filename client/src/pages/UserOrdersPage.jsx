import "./styles/UserOrdersPage.css";
import Loader from "../components/UI/loader/Loader";
import UserOrdersSearchInput from "../components/UserOrdersSearchInput";
import UserPageOrderList from "../components/UserPageOrderList";
import URLActions from "../utils/URLActions";
import UIButton from "../components/UI/uiButton/UIButton";
import { ROOT_ROUTE } from "../utils/consts";

const UserOrdersPage = ({ 
  orders, initialOrders, ordersSellerFeedbacksObjArray, 
  userDeviceFeedbacksObjArray, isLoading, isInitialRender 
}) => {
  if (isLoading || isInitialRender) return (
    <section className="user-page-section">
      <header>
        <h2>
          Your orders
        </h2>
      </header>
      <Loader className="user-page-loader" />
    </section>
  );

  function getChildren() {
    if (orders?.length) {
      return (
        <>
          <UserOrdersSearchInput sortedOrders={orders} initialOrders={initialOrders} />
          <UserPageOrderList 
            orders={orders} 
            ordersSellerFeedbacksObjArray={ordersSellerFeedbacksObjArray} 
            userDeviceFeedbacksObjArray={userDeviceFeedbacksObjArray}
          />
        </>
      );
    } else {
      const orderQuery = URLActions.getParamValue("orderQuery");

      if (orderQuery && initialOrders?.length) {
        const url = URLActions.deleteParamValue("orderQuery", orderQuery);
        const basename = process.env.REACT_APP_CLIENT_URL;
        const to = url.replace(basename, "");

        return (
          <>
            <UserOrdersSearchInput sortedOrders={orders} initialOrders={initialOrders} />
            <div className="user-orders-show-all-wrap">
              <p>There's no such orders</p>
              <UIButton isLink={true} to={to}>
                Show all orders
              </UIButton>
            </div>
          </>
        );
      } else {
        return (
          <section className="user-page-no-data-msg-section">
            <header>
              <h3>
                You have not ordered anything yet
              </h3>
            </header>
            <p className="user-page-no-data-msg">
              There could be some beautiful couples of them
            </p>
            <UIButton isLink={true} to={ROOT_ROUTE}>
              Add them
            </UIButton>
          </section>
        );
      }
    }
  }

  return (
    <section className="user-page-section">
      <header>
        <h2>
          Your orders
        </h2>
      </header>
      {getChildren()}
    </section>
  );
}

export default UserOrdersPage;
