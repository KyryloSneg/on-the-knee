import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";
import CommentsSection from '../components/CommentsSection';

const SellerFeedbacksPage = ({ seller, feedbacks }) => {
  useSettingDocumentTitle(`Feedbacks for ${seller?.name || "..."}`);
  if (!seller) return;

  return (
    <CommentsSection type="sellerFeedbacks" comments={feedbacks} seller={seller} isTopElemMain={true} />
  );
}

export default SellerFeedbacksPage;
