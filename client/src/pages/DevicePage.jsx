import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../Context";
import MainDevicePage from "./MainDevicePage";
import DeviceInfoPage from "./DeviceInfoPage";
import DeviceCommentsPage from "./DeviceCommentsPage";
import DeviceQuestionsPage from "./DeviceQuestionsPage";
import TabsPageLayout from "../components/UI/tabsPageLayout/TabsPageLayout";
import { useParams } from "react-router-dom";
import { DEVICE_COMMENTS_ROUTE, DEVICE_INFO_ROUTE, DEVICE_QUESTIONS_ROUTE, DEVICE_ROUTE } from "../utils/consts";
import useOneDeviceFetching from "../hooks/useOneDeviceFetching";
import useOneDeviceFeedbacksFetching from "../hooks/useOneDeviceFeedbacksFetching";
import { observer } from "mobx-react-lite";

const POSSIBLE_TYPES = ["main", "info", "comments", "questions"];
const DevicePage = observer(({ type }) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Device Page is not defined or incorrect");

  const { app } = useContext(Context);
  const pageRef = useRef(null);
  const { deviceIdCombo } = useParams();
  const [device, setDevice] = useState(null);

  let [id, combinationString] = deviceIdCombo.split("--");
  id = +id;

  useOneDeviceFetching(id, setDevice);
  useOneDeviceFeedbacksFetching(device?.id, null, null, app);

  useEffect(() => {
    app.setPageRef(pageRef);
  }, [app]);

  function renderInnerPage() {
    let innerPage;

    if (type === "main") {
      innerPage = (
        <MainDevicePage 
          device={device} 
          combinationString={combinationString} 
          feedbacks={app.deviceFeedbacks}
        />
      );
    } else if (type === "info") {
      innerPage = <DeviceInfoPage device={device} />;
    } else if (type === "comments") {
      innerPage = <DeviceCommentsPage device={device} feedbacks={app.deviceFeedbacks} />;
    } else if (type === "questions") {
      innerPage = <DeviceQuestionsPage device={device} questions={app.deviceQuestions} />;
    }

    return innerPage;
  }

  const tabsData = [
    { name: "Everything about device", to: DEVICE_ROUTE + deviceIdCombo },
    { name: "Info", to: DEVICE_INFO_ROUTE.replace(":deviceIdCombo", deviceIdCombo) },
    { name: 
      `Comments (${app.deviceFeedbacks?.length || 0})`, 
      to: DEVICE_COMMENTS_ROUTE.replace(":deviceIdCombo", deviceIdCombo) 
    },
    { 
      name: `Questions (${app.deviceQuestions?.length || 0})`, 
      to: DEVICE_QUESTIONS_ROUTE.replace(":deviceIdCombo", deviceIdCombo) 
    },
  ];

  return (
    <main ref={pageRef}>
      <TabsPageLayout tabsData={tabsData} pageContent={renderInnerPage()} />
    </main>
  );
});

export default DevicePage;
