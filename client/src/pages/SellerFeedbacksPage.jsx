import CommentsSection from '../components/CommentsSection';

const SellerFeedbacksPage = ({ seller, feedbacks }) => {
  if (!seller) return <div />;

  return (
    <CommentsSection type="sellerFeedbacks" comments={feedbacks} seller={seller} isTopElemMain={true} />
  );
}

export default SellerFeedbacksPage;
