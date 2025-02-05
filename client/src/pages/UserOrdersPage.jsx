import "./styles/UserOrdersPage.css";
import Loader from "../components/UI/loader/Loader";
import UserOrdersSearchInput from "../components/UserOrdersSearchInput";
import UserPageOrderList from "../components/UserPageOrderList";
import URLActions from "../utils/URLActions";
import UIButton from "../components/UI/uiButton/UIButton";
import { CLIENT_URL, ROOT_ROUTE } from "../utils/consts";
import { useContext } from "react";
import { Context } from "Context";
import { observer } from "mobx-react-lite";
import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";

const UserOrdersPage = observer(({ 
  orders, initialOrders, userDeviceFeedbacksObjArray, 
  isLoading, isInitialRender 
}) => {
  useSettingDocumentTitle("Your orders");

  const { fetchRefStore } = useContext(Context);
  const isToShowLoaderOnInitialRender = (
    isInitialRender && !fetchRefStore.hasAlreadyFetchedUserOrders
  );

  if (isLoading || isToShowLoaderOnInitialRender) return (
    <section className="user-page-section">
      <h2>
        Your orders
      </h2>
      <Loader className="user-page-loader" />
    </section>
  );

  function getChildren() {
    if (orders?.length) {
      return (
        <>
          <UserOrdersSearchInput sortedOrders={orders} initialOrders={initialOrders} />
          <UserPageOrderList orders={orders} userDeviceFeedbacksObjArray={userDeviceFeedbacksObjArray} />
        </>
      );
    } else {
      const orderQuery = URLActions.getParamValue("orderQuery");

      if (orderQuery && initialOrders?.length) {
        const url = URLActions.deleteParamValue("orderQuery", orderQuery);
        const basename = CLIENT_URL;
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
            <h3>
              You have not ordered anything yet
            </h3>
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
      <h2>
        Your orders
      </h2>
      {getChildren()}
    </section>
  );
});

export default UserOrdersPage;
