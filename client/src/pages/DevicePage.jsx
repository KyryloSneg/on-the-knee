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

  const { deviceStore } = useContext(Context);
  const { deviceIdCombo } = useParams();
  const [device, setDevice] = useState(null);

  let [id, combinationString] = deviceIdCombo.split("--");
  id = +id;

  // using prevId to evade bugs that could possibly happen on switching between two different devices in browser history
  const prevId = useRef(id);

  useOneDeviceFetching(id, setDevice);
  useOneDeviceFeedbacksFetching(device?.id, null, null, deviceStore);

  function renderInnerPage() {
    let innerPage;

    if (type === "main") {
      const sortedByDateFeedbacks = [...deviceStore.deviceFeedbacks].sort(
        (a, b) => b.date.localeCompare(a.date)
      );

      innerPage = (
        <MainDevicePage 
          device={device} 
          combinationString={combinationString} 
          feedbacks={sortedByDateFeedbacks}
        />
      );
    } else if (type === "info") {
      innerPage = <DeviceInfoPage device={device} />;
    } else if (type === "comments") {
      const sortedByDateFeedbacks = [...deviceStore.deviceFeedbacks].sort(
        (a, b) => b.date.localeCompare(a.date)
      );

      innerPage = <DeviceCommentsPage device={device} feedbacks={sortedByDateFeedbacks} />;
    } else if (type === "questions") {
      const sortedByDateQuestions = [...deviceStore.deviceQuestions].sort(
        (a, b) => b.date.localeCompare(a.date)
      );

      innerPage = <DeviceQuestionsPage device={device} questions={sortedByDateQuestions} />;
    }

    return innerPage;
  }

  const tabsData = [
    { name: "Everything about device", to: DEVICE_ROUTE + deviceIdCombo },
    { name: "Info", to: DEVICE_INFO_ROUTE.replace(":deviceIdCombo", deviceIdCombo) },
    { name: 
      `Comments (${deviceStore.deviceFeedbacks?.length || 0})`, 
      to: DEVICE_COMMENTS_ROUTE.replace(":deviceIdCombo", deviceIdCombo) 
    },
    { 
      name: `Questions (${deviceStore.deviceQuestions?.length || 0})`, 
      to: DEVICE_QUESTIONS_ROUTE.replace(":deviceIdCombo", deviceIdCombo) 
    },
  ];

  useEffect(() => {
    prevId.current = id;
  }, [id]);
  
  return (
    <main>
      {prevId.current === id && <TabsPageLayout tabsData={tabsData} pageContent={renderInnerPage()} />}
    </main>
  );
});

export default DevicePage;
