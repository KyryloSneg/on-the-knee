import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";
import CommentsSection from '../components/CommentsSection';
import MetaTagsInPublicRoute from "components/MetaTagsInPublicRoute";

const SellerFeedbacksPage = ({ seller, feedbacks }) => {
  useSettingDocumentTitle(`Feedbacks for ${seller?.name || "..."}`);
  if (!seller) return;

  return (
    <>
      <MetaTagsInPublicRoute 
        description={`User feedbacks for the seller ${seller?.name}. Up-to-date reviews with a plenty of real photos in On the knee store`} 
        keywords={`seller, ${seller?.name}, feedbacks, comments, reviews`} 
        isToRender={seller?.name}
      />
      <CommentsSection type="sellerFeedbacks" comments={feedbacks} seller={seller} isTopElemMain={true} />
    </>
  );
}

export default SellerFeedbacksPage;
