import "./styles/UserPage.css";
import TabsPageLayout from "../components/UI/tabsPageLayout/TabsPageLayout";
import { USER_DESIRED_LIST_ROUTE, USER_FEEDBACKS_ROUTE, USER_ORDERS_ROUTE, USER_VIEWED_DEVICES_ROUTE } from "../utils/consts";
import DesiredListPage from "./DesiredListPage";
import UserFeedbacksPage from "./UserFeedbacksPage";
import UserOrdersPage from "./UserOrdersPage";
import UserViewedDevicesPage from "./UserViewedDevicesPage";

const ordersIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343">
    <path d="M160-160v-516L82-846l72-34 94 202h464l94-202 72 34-78 170v516H160Zm240-280h160q17 0 28.5-11.5T600-480q0-17-11.5-28.5T560-520H400q-17 0-28.5 11.5T360-480q0 17 11.5 28.5T400-440ZM240-240h480v-358H240v358Zm0 0v-358 358Z"/>
  </svg>
);

const desiredListIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#434343">
    <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
  </svg>
);

const viewedDevicesIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343">
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
  </svg>
);

const feedbacksIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343">
    <path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z"/>
  </svg>
);

const POSSIBLE_TYPES = ["orders", "desired-list", "viewed-devices", "feedbacks"];
const UserPage = ({ type }) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of UserPage is not defined or incorrect");

  function renderInnerPage() {
    if (type === "orders") {
      return <UserOrdersPage />;
    } else if (type === "desired-list") {
      return <DesiredListPage />;
    } else if (type === "viewed-devices") {
      return <UserViewedDevicesPage />;
    } else if (type === "feedbacks") {
      return <UserFeedbacksPage />;
    };
  };

  const tabsData = [
    { name: "Orders", to: USER_ORDERS_ROUTE, svgIcon: ordersIcon },
    { name: "Desired list", to: USER_DESIRED_LIST_ROUTE, svgIcon: desiredListIcon },
    { name: "Viewed devices", to: USER_VIEWED_DEVICES_ROUTE, svgIcon: viewedDevicesIcon },
    { name: "Feedbacks", to: USER_FEEDBACKS_ROUTE, svgIcon: feedbacksIcon },
  ];

  // TODO: change isVerticalLayout to true for mobile resolutions
  return (
    <main className="user-page">
      <TabsPageLayout 
        tabsData={tabsData} 
        pageContent={renderInnerPage()} 
        doesHaveDynamicParam={false} 
        isVerticalLayout={false}
      />
    </main>
  );
};

export default UserPage;
