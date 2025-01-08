import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";
import CommentsSection from "../components/CommentsSection";
import MetaTagsInPublicRoute from "components/MetaTagsInPublicRoute";

const DeviceCommentsPage = ({ device, feedbacks }) => {
  useSettingDocumentTitle(`Device feedbacks for ${device?.name || "..."}`);

  return (
    <>
      <MetaTagsInPublicRoute 
        description={`User feedbacks for ${device?.name}. Up-to-date reviews with a plenty of real photos in On the knee store`} 
        keywords={`device, ${device?.name}, feedbacks, comments, reviews`} 
        isToRender={device?.name}
      />
      <CommentsSection
        type="deviceFeedbacks"
        comments={feedbacks}
        isFullVersion={true}
        device={device}
      />
    </>
  );
}

export default DeviceCommentsPage;
