import CommentsSection from "../components/CommentsSection";
import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";

const DeviceQuestionsPage = ({ device, questions }) => {
  useSettingDocumentTitle(`Questions for ${device?.name || "..."}`);

  return (
    <CommentsSection
      type="deviceQuestions"
      comments={questions}
      isFullVersion={true}
      device={device}
    />
  );
}

export default DeviceQuestionsPage;
