import CommentsSection from "../components/UI/commentsSection/CommentsSection";

const DeviceCommentsPage = ({ device, feedbacks }) => {
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
