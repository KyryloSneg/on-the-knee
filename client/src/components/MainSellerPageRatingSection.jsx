import "./styles/MainSellerPageRatingSection.css";
import MainSellerPageOverallRatingSection from "./MainSellerPageOverallRatingSection";
import MainSellerPageSeparateRatingSection from "./MainSellerPageSeparateRatingSection";

const MainSellerPageRatingSection = ({ seller, ratingsObj, feedbacksAmount, feedbacksAmountObj }) => {
  return (
    <main className="main-seller-page-rating-section">
      <MainSellerPageOverallRatingSection 
        seller={seller} 
        ratingsObj={ratingsObj}
        feedbacksAmount={feedbacksAmount} 
      />
      <MainSellerPageSeparateRatingSection feedbacksAmountObj={feedbacksAmountObj} />
    </main>
  );
}

export default MainSellerPageRatingSection;
