import { observer } from "mobx-react-lite";
import Loader from "../components/UI/loader/Loader";
import { ROOT_ROUTE, USER_FEEDBACKS_ROUTE, USER_SELLERS_FEEDBACKS_ROUTE } from "utils/consts";
import UIButton from "components/UI/uiButton/UIButton";
import TabsPageLayout from "components/UI/tabsPageLayout/TabsPageLayout";
import UserSellersFeedbacksPage from "./UserSellersFeedbacksPage";
import UserDevicesFeedbacksPage from "./UserDevicesFeedbacksPage";

const POSSIBLE_TYPES = ["devicesFeedbacks", "sellersFeedbacks"];
const UserFeedbacksPage = observer(({ 
  type, orders, ordersSellerFeedbacksObjArray, isInitialRender, areOrdersLoading, areOrdersListSellersLoading,
  userDeviceFeedbacksObjArray, 
}) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of UserFeedbacksPage is not defined or incorrect");

  if (areOrdersLoading || areOrdersListSellersLoading || isInitialRender) return (
    <section className="user-page-section">
      <header>
        <h2>
          Your feedbacks
        </h2>
      </header>
      <Loader className="user-page-loader" />
    </section>
  );

  function renderInnerPage() {
    if (type === "devicesFeedbacks") {
      return (
        <UserDevicesFeedbacksPage orders={orders} userDeviceFeedbacksObjArray={userDeviceFeedbacksObjArray} />
      );
    } else if (type === "sellersFeedbacks") {
      return (
        <UserSellersFeedbacksPage ordersSellerFeedbacksObjArray={ordersSellerFeedbacksObjArray} />
      );
    }
  }

  const tabsData = [
    { children: "Devices", to: USER_FEEDBACKS_ROUTE },
    { children: "Sellers", to: USER_SELLERS_FEEDBACKS_ROUTE },
  ];

  return (
    <section className="user-page-section">
      <header>
        <h2>
          Your feedbacks
        </h2>
      </header>
      {(!!orders?.length || !!ordersSellerFeedbacksObjArray?.length)
        ? (
          <TabsPageLayout
            tabsData={tabsData}
            pageContent={renderInnerPage()}
            doesHaveDynamicParam={false}
            propsClassName="user-page-feedbacks"
          />
        )
        : (
          <section className="user-page-no-data-msg-section">
            <header>
              <h3>
                You haven't bought anything to remain a feedback
              </h3>
            </header>
            <p className="user-page-no-data-msg">
              Find your dream devices
            </p>
            <UIButton isLink={true} to={ROOT_ROUTE}>
              Search up them
            </UIButton>
          </section>
        )
      }
    </section>
  );
});

export default UserFeedbacksPage;
