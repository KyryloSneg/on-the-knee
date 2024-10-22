import "./styles/UserPage.css";
import TabsPageLayout from "../components/UI/tabsPageLayout/TabsPageLayout";
import { USER_DESIRED_LIST_ROUTE, USER_FEEDBACKS_ROUTE, USER_ORDERS_ROUTE, USER_PERSONAL_DATA_ROUTE, USER_VIEWED_DEVICES_ROUTE, WIDTH_TO_SHOW_USER_PAGE_DESKTOP_VERSION } from "../utils/consts";
import DesiredListPage from "./DesiredListPage";
import UserFeedbacksPage from "./UserFeedbacksPage";
import UserOrdersPage from "./UserOrdersPage";
import UserViewedDevicesPage from "./UserViewedDevicesPage";
import UserPersonalDataPage from "./UserPersonalDataPage";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Context } from "../Context";
import useWindowWidth from "../hooks/useWindowWidth";
import useGettingOneUserOrders from "../hooks/useGettingOneUserOrders";
import useGettingSortedUserPageOrders from "../hooks/useGettingSortedUserPageOrders";
import _ from "lodash";

// icon from the assets doesn't scale properly with changing width / height through css
const accountIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg>
);

const ordersIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343">
    <path d="M160-160v-516L82-846l72-34 94 202h464l94-202 72 34-78 170v516H160Zm240-280h160q17 0 28.5-11.5T600-480q0-17-11.5-28.5T560-520H400q-17 0-28.5 11.5T360-480q0 17 11.5 28.5T400-440ZM240-240h480v-358H240v358Zm0 0v-358 358Z" />
  </svg>
);

const desiredListIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#434343">
    <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
  </svg>
);

const viewedDevicesIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343">
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
  </svg>
);

const feedbacksIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343">
    <path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z" />
  </svg>
);

const POSSIBLE_TYPES = ["personal-data", "orders", "desired-list", "viewed-devices", "feedbacks"];
const UserPage = observer(({ type }) => {
  const { user } = useContext(Context);
  const windowWidth = useWindowWidth();
  const [orders, setOrders] = useState([]);

  // using state instead of a ref, because sometimes 
  // the user orders page starts infinitely loading, and with the setter 
  // we re-render the component
  const [isInitialRender, setIsInitialRender] = useState(true);
  const areOrdersLoading = useGettingOneUserOrders(user.user?.id, setOrders);

  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  // from new orders to old ones
  let sortedByDateOrders = _.cloneDeep(orders);
  sortedByDateOrders.sort((a, b) => b.date.localeCompare(a.date));
  const sortedByQueryOrders = useGettingSortedUserPageOrders(sortedByDateOrders);

  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of UserPage is not defined or incorrect");

  function renderInnerPage() {
    if (type === "personal-data") {
      return <UserPersonalDataPage />;
    } else if (type === "orders") {
      return (
        <UserOrdersPage 
          orders={sortedByQueryOrders} 
          initialOrders={sortedByDateOrders} 
          isLoading={areOrdersLoading} 
          isInitialRender={isInitialRender} 
        />
      );
    } else if (type === "desired-list") {
      return <DesiredListPage />;
    } else if (type === "viewed-devices") {
      return <UserViewedDevicesPage />;
    } else if (type === "feedbacks") {
      return <UserFeedbacksPage />;
    };
  };

  const accountTabChildren = (
    <div className="personal-data-acc-content-wrap">
      <p>
        {user.user?.name || ""} {user.user?.surname || ""}
      </p>
      <p className="personal-data-acc-user-email">
        {user.userAddress?.email || ""}
      </p>
    </div>
  );

  const tabsData = [
    { children: accountTabChildren, to: USER_PERSONAL_DATA_ROUTE, svgIcon: accountIcon },
    { children: "Orders", to: USER_ORDERS_ROUTE, svgIcon: ordersIcon },
    { children: "Desired list", to: USER_DESIRED_LIST_ROUTE, svgIcon: desiredListIcon },
    { children: "Viewed devices", to: USER_VIEWED_DEVICES_ROUTE, svgIcon: viewedDevicesIcon },
    { children: "Feedbacks", to: USER_FEEDBACKS_ROUTE, svgIcon: feedbacksIcon },
  ];

  // TODO: change isVerticalLayout to true for mobile resolutions
  return (
    <main className="user-page">
      <TabsPageLayout
        tabsData={tabsData}
        pageContent={renderInnerPage()}
        doesHaveDynamicParam={false}
        isVerticalLayout={windowWidth < WIDTH_TO_SHOW_USER_PAGE_DESKTOP_VERSION}
      />
    </main>
  );
});

export default UserPage;
