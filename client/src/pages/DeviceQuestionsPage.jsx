import CommentsSection from "../components/CommentsSection";

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
