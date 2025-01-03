import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";
import CommentsSection from "../components/CommentsSection";

const DeviceCommentsPage = ({ device, feedbacks }) => {
  useSettingDocumentTitle(`Device feedbacks for ${device?.name || "..."}`);

  return (
    <CommentsSection
      type="deviceFeedbacks"
      comments={feedbacks}
      isFullVersion={true}
      device={device}
    />
  );
}

export default DeviceCommentsPage;
