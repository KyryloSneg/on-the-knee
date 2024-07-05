import CommentsSection from "../components/UI/commentsSection/CommentsSection";

const DeviceQuestionsPage = ({ device, questions }) => {
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
