import "./styles/MainSellerPage.css";
import SellerScheduleSection from "../components/SellerScheduleSection";
import MainSellerPageRatingSection from "../components/MainSellerPageRatingSection";
import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";
import MetaTagsInPublicRoute from "components/MetaTagsInPublicRoute";

const MainSellerPage = ({ seller, feedbacks }) => {
  useSettingDocumentTitle(seller?.name || "...");
  if (!seller) return;

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
    <div className="main-seller-page">
      <MetaTagsInPublicRoute 
        description={`Seller ${seller?.name} in On the knee store. Favorable prices $, huge discounts %`} 
        keywords={`seller, ${seller?.name}`} 
        isToRender={seller?.name}
      />
      <MainSellerPageRatingSection 
        seller={seller} 
        ratingsObj={ratingsObj}
        feedbacksAmount={feedbacksAmount}
        feedbacksAmountObj={feedbacksAmountObj}
      />
      <SellerScheduleSection seller={seller} />
    </div>
  );
}

export default MainSellerPage;
