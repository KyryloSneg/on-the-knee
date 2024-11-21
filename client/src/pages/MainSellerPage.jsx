import "./styles/MainSellerPage.css";
import SellerScheduleSection from "../components/SellerScheduleSection";
import MainSellerPageRatingSection from "../components/MainSellerPageRatingSection";

const MainSellerPage = ({ seller, feedbacks }) => {
  if (!seller) return <div />;

  let feedbacksAmountObj = {
    "is-up-to-date-rate": [],
    "delivery-speed-rate": [],
    "service-quality-rate": [],
  };

  let ratingsObj = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };

  for (let feedback of feedbacks) {
    const upToDateRate = feedback["is-up-to-date-rate"];
    const deliverySpeedRate = feedback["delivery-speed-rate"];
    const serviceQualityRate = feedback["service-quality-rate"];

    ratingsObj[upToDateRate] += 1;
    ratingsObj[deliverySpeedRate] += 1;
    ratingsObj[serviceQualityRate] += 1;

    feedbacksAmountObj["is-up-to-date-rate"].push(upToDateRate);
    feedbacksAmountObj["delivery-speed-rate"].push(deliverySpeedRate);
    feedbacksAmountObj["service-quality-rate"].push(serviceQualityRate);
  }

  const feedbacksAmount = 
    feedbacksAmountObj["is-up-to-date-rate"].length 
    + feedbacksAmountObj["delivery-speed-rate"].length 
    + feedbacksAmountObj["service-quality-rate"].length;

  return (
    <section className="main-seller-page">
      <MainSellerPageRatingSection 
        seller={seller} 
        ratingsObj={ratingsObj}
        feedbacksAmount={feedbacksAmount}
        feedbacksAmountObj={feedbacksAmountObj}
      />
      <SellerScheduleSection seller={seller} />
    </section>
  );
}

export default MainSellerPage;
