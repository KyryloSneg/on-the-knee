import "./styles/ReportOrderProblemModal.css";
import { useContext } from "react";
import { Context } from "../Context";
import ModalWindow from "./UI/modalWindow/ModalWindow";
import setReportOrderProblemModalVisibility from "../utils/setReportOrderProblemModalVisibility";
import ReportOrderProblemModalContent from "./ReportOrderProblemModalContent";
import { observer } from "mobx-react-lite";

const ReportOrderProblemModal = observer(() => {
  const { app } = useContext(Context);

  function setIsReportOrderProblemModalVisible(isVisible) {
    setReportOrderProblemModalVisibility(isVisible, app);
  }

  return (
    <ModalWindow
      isVisible={app.isVisibleReportOrderProblemModal}
      setIsVisible={setIsReportOrderProblemModalVisible}
      children={
        <ReportOrderProblemModalContent closeModal={() => setIsReportOrderProblemModalVisible(false)} />
      }
      headerText="Report a problem"
      id="report-an-order-problem-modal"
      triggerElemRef={app.reportOrderProblemBtnRef}
    />
  );
});

export default ReportOrderProblemModal;