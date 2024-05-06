import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import MainDevicePage from "./MainDevicePage";
import DeviceInfoPage from "./DeviceInfoPage";
import DeviceCommentsPage from "./DeviceCommentsPage";
import DeviceQuestionsPage from "./DeviceQuestionsPage";
import TabsPageLayout from "../components/UI/tabsPageLayout/TabsPageLayout";
import { useParams } from "react-router-dom";
import { DEVICE_COMMENTS_ROUTE, DEVICE_INFO_ROUTE, DEVICE_QUESTIONS_ROUTE, DEVICE_ROUTE } from "../utils/consts";

const POSSIBLE_TYPES = ["main", "info", "comments", "questions"];
const DevicePage = ({ type }) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Device Page is not defined");

  const { app } = useContext(Context);
  const pageRef = useRef(null);
  const { deviceIdCombo } = useParams();

  useEffect(() => {
    app.setPageRef(pageRef);
  }, [app]);

  function renderInnerPage() {
    let innerPage;

    if (type === "main") {
      innerPage = <MainDevicePage />
    } else if (type === "info") {
      innerPage = <DeviceInfoPage />
    } else if (type === "comments") {
      innerPage = <DeviceCommentsPage />
    } else if (type === "questions") {
      innerPage = <DeviceQuestionsPage />
    }

    return innerPage;
  }

  const tabsData = [
    { name: "Everything about device", to: DEVICE_ROUTE + deviceIdCombo },
    { name: "Info", to: DEVICE_INFO_ROUTE.replace(":deviceIdCombo", deviceIdCombo) },
    { name: "Comments", to: DEVICE_COMMENTS_ROUTE.replace(":deviceIdCombo", deviceIdCombo) },
    { name: "Questions", to: DEVICE_QUESTIONS_ROUTE.replace(":deviceIdCombo", deviceIdCombo) },
  ];

  return (
    <main ref={pageRef}>
      DevicePage
      <TabsPageLayout tabsData={tabsData} pageContent={renderInnerPage()} />
    </main>
  );
};

export default DevicePage;
