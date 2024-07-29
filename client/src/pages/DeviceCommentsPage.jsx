import CommentsSection from "../components/CommentsSection";

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
