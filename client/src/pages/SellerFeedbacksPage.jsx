import React from 'react';

const SellerFeedbacksPage = ({ seller, feedbacks }) => {
  if (!seller || !feedbacks?.length) return <div />;

  return (
    <section className="seller-feedbacks-page">
      Seller feedbacks
    </section>
  );
}

export default SellerFeedbacksPage;
