import { useContext, useEffect, useMemo, useRef, useState } from "react";
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
import useGettingSalesAndTypeNames from "hooks/useGettingSalesAndTypeNames";
import useGettingAddServicesRelatedData from "hooks/useGettingAddServicesRelatedData";
import useAddingViewedDeviceOnVisit from "hooks/useAddingViewedDeviceOnVisit";
import useGettingCartData from "hooks/useGettingCartData";
import useOneSellerFetching from "hooks/useOneSellerFetching";

const POSSIBLE_TYPES = ["main", "info", "comments", "questions"];
const DevicePage = observer(({ type }) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Device Page is not defined or incorrect");

  const { deviceStore, user, fetchRefStore } = useContext(Context);
  const { deviceIdCombo } = useParams();
  
  let [id, combinationString] = deviceIdCombo.split("--");
  id = +id;

  const initialDevice = useMemo(() => (
    fetchRefStore.lastDevicePageDeviceFetchResult?.id === id 
      ? fetchRefStore.lastDevicePageDeviceFetchResult 
      : null
  ), [id, fetchRefStore.lastDevicePageDeviceFetchResult]);

  const [device, setDevice] = useState(initialDevice);
  const initialSeller = useMemo(() => (
    (fetchRefStore.lastDevicePageFetchSeller !== null && fetchRefStore.lastDevicePageFetchSeller?.id !== undefined)
    && fetchRefStore.lastDevicePageFetchSeller?.id === initialDevice?.sellerId 
      ? fetchRefStore.lastDevicePageFetchSeller
      : null
  ), [initialDevice?.sellerId, fetchRefStore.lastDevicePageFetchSeller]);

  console.log(initialDevice, initialSeller);
  

  const [seller, setSeller] = useState(initialSeller);
  const [additionalServicesObj, setAdditionalServicesObj] = useState([]);

  // using prevId to evade bugs that could possibly happen on switching between two different devices in browser history
  const prevId = useRef(id);
  const prevViewedDeviceComboIdRef = useRef(null);

  useEffect(() => {
    setDevice(initialDevice);
    setSeller(initialSeller);
  }, [id, initialDevice, initialSeller]);

  useOneDeviceFetching(id, setDevice, !device, true);
  useOneDeviceFeedbacksFetching(device?.id, null, null, false, true, true, "", true);

  useEffect(() => {
    if (device) fetchRefStore.setLastDevicePageDeviceFetchResult(device);
  }, [fetchRefStore, device]);

  const isToFetchMiscData = !initialDevice;
  // theoretically setting sales and sale type names would not lead to bugs in the catalog page
  useGettingSalesAndTypeNames(isToFetchMiscData);
  useOneSellerFetching(device?.sellerId, setSeller, !seller, false, true);
  useGettingAddServicesRelatedData(device, setAdditionalServicesObj, true, false, null, isToFetchMiscData);

  const devCombos = device?.["device-combinations"];
  let selectedCombination;

  if (devCombos?.length > 1) {
    selectedCombination = devCombos?.find(combo => combo.combinationString === combinationString);
  } else {
    selectedCombination = devCombos?.[0];
  }

  useAddingViewedDeviceOnVisit(device?.id, selectedCombination?.id, prevViewedDeviceComboIdRef);

  const cartFetching = useGettingCartData(user.cart?.id, null, true, true);
  function cartDataFetching() {
    cartFetching(user.cart?.id, null, true);
  }

  function renderInnerPage() {
    let innerPage;

    const hasCommentsAlreadyFetched = (
      (
        fetchRefStore.lastDevicePageDeviceIdWithFetchedComments !== null
        && fetchRefStore.lastDevicePageDeviceIdWithFetchedComments !== undefined
      )
      && fetchRefStore.lastDevicePageDeviceIdWithFetchedComments === device?.id
    );

    if (type === "main") {
      const sortedByDateFeedbacks = [...deviceStore.devicesFeedbacks].sort(
        (a, b) => b.date.localeCompare(a.date)
      );

      innerPage = (
        <MainDevicePage 
          device={device} 
          combinationString={combinationString} 
          feedbacks={sortedByDateFeedbacks}
          seller={seller}
          additionalServicesObj={additionalServicesObj}
          selectedCombination={selectedCombination}
          cartDataFetching={cartDataFetching}
        />
      );
    } else if (type === "info") {
      innerPage = <DeviceInfoPage device={device} />;
    } else if (type === "comments") {
      const sortedByDateFeedbacks = [...deviceStore.devicesFeedbacks].sort(
        (a, b) => b.date.localeCompare(a.date)
      );

      innerPage = (
        <DeviceCommentsPage 
          device={device} 
          feedbacks={hasCommentsAlreadyFetched ? sortedByDateFeedbacks : []} 
        />
      );
    } else if (type === "questions") {
      const sortedByDateQuestions = [...deviceStore.deviceQuestions].sort(
        (a, b) => b.date.localeCompare(a.date)
      );

      innerPage = (
        <DeviceQuestionsPage 
          device={device} 
          questions={hasCommentsAlreadyFetched ? sortedByDateQuestions : []} 
        />
      );
    }

    return innerPage;
  }

  const tabsData = [
    { children: "Everything about device", to: DEVICE_ROUTE + deviceIdCombo },
    { children: "Info", to: DEVICE_INFO_ROUTE.replace(":deviceIdCombo", deviceIdCombo) },
    { children: 
      `Comments (${deviceStore.devicesFeedbacks?.length || 0})`, 
      to: DEVICE_COMMENTS_ROUTE.replace(":deviceIdCombo", deviceIdCombo) 
    },
    { 
      children: `Questions (${deviceStore.deviceQuestions?.length || 0})`, 
      to: DEVICE_QUESTIONS_ROUTE.replace(":deviceIdCombo", deviceIdCombo) 
    },
  ];

  useEffect(() => {
    prevId.current = id;
  }, [id]);
  
  return (
    <main className="device-page">
      {prevId.current === id && (
        <TabsPageLayout 
          tabsData={tabsData} 
          pageContent={renderInnerPage()} 
          doesHaveDynamicParam={true} 
        />
      )}
    </main>
  );
});

export default DevicePage;
