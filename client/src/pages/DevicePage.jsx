import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import MainDevicePage from "./MainDevicePage";
import DeviceInfoPage from "./DeviceInfoPage";
import DeviceCommentsPage from "./DeviceCommentsPage";
import DeviceQuestionsPage from "./DeviceQuestionsPage";

const POSSIBLE_TYPES = ["main", "info", "comments", "questions"];
const DevicePage = ({ type }) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Device Page is not defined");

  const { app } = useContext(Context);
  const pageRef = useRef(null);

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

  return (
    <main>
      DevicePage
      {renderInnerPage()}
    </main>
  );
};

export default DevicePage;
