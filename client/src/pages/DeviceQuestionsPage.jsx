import MetaTagsInPublicRoute from "components/MetaTagsInPublicRoute";
import CommentsSection from "../components/CommentsSection";
import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";

const DeviceQuestionsPage = ({ device, questions }) => {
  useSettingDocumentTitle(`Questions for ${device?.name || "..."}`);

  return (
    <>
      <MetaTagsInPublicRoute 
        description={
          `User questions for ${device?.name}. Up-to-date questions ? with a plenty of real photos, quick and brief answers to them in On the knee store`
        } 
        keywords={`device, ${device?.name}, questions, answers`} 
        isToRender={device?.name}
      />
      <CommentsSection
        type="deviceQuestions"
        comments={questions}
        isFullVersion={true}
        device={device}
      />
    </>
  );
}

export default DeviceQuestionsPage;
