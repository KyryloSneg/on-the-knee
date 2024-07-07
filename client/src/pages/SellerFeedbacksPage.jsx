import React from 'react';
import CommentsSection from '../components/UI/commentsSection/CommentsSection';

const SellerFeedbacksPage = ({ seller, feedbacks }) => {
  if (!seller || !feedbacks?.length) return <div />;

  return (
    <CommentsSection type="sellerFeedbacks" comments={feedbacks} seller={seller} />
  );
}

export default SellerFeedbacksPage;
