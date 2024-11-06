import "./styles/SellerPage.css";
import { useContext, useState } from 'react';
import TabsPageLayout from '../components/UI/tabsPageLayout/TabsPageLayout';
import useOneSellerFetching from '../hooks/useOneSellerFetching';
import useOneSellerFeedbacksFetching from '../hooks/useOneSellerFeedbacksFetching';
import { SELLER_DEVICES_ROUTE, SELLER_FEEDBACKS_ROUTE, SELLER_ROUTE } from '../utils/consts';
import { useParams } from 'react-router-dom';
import MainSellerPage from './MainSellerPage';
import SellerFeedbacksPage from './SellerFeedbacksPage';
import SellerDevicesPage from './SellerDevicesPage';
import { Context } from '../Context';
import { observer } from 'mobx-react-lite';
import StarRating from '../components/UI/starRating/StarRating';

const POSSIBLE_TYPES = ["main", "feedbacks", "devices"];
const SellerPage = observer(({ type }) => {
  const { deviceStore } = useContext(Context);
  const { sellerIdSlug } = useParams();
  const [seller, setSeller] = useState(null);

  let [id] = sellerIdSlug.split("--");
  id = +id;

  useOneSellerFetching(id, setSeller);
  useOneSellerFeedbacksFetching(seller?.id);

  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Seller Page is not defined or incorrect");

  function renderInnerPage() {
    let innerPage;

    if (type === "main") {
      innerPage = <MainSellerPage seller={seller} feedbacks={deviceStore.sellersFeedbacks} />;
    } else if (type === "feedbacks") {
      innerPage = <SellerFeedbacksPage seller={seller} feedbacks={deviceStore.sellersFeedbacks} />;
    } else if (type === "devices") {
      innerPage = <SellerDevicesPage seller={seller} />;
    }

    return innerPage;
  }

  const tabsData = [
    { children: "Everything about seller", to: SELLER_ROUTE + sellerIdSlug },
    {
      children:
        `Comments (${deviceStore.sellersFeedbacks?.length || 0})`,
      to: SELLER_FEEDBACKS_ROUTE.replace(":sellerIdSlug", sellerIdSlug)
    },
    { children: "Devices", to: SELLER_DEVICES_ROUTE.replace(":sellerIdSlug", sellerIdSlug) },
  ];

  return (
    <main className="seller-page">
      <h2 className="top-h2">
        Seller {seller?.name || ""}
      </h2>
      <div className="seller-page-rating-wrap">
        <p>
          {seller?.rating}
        </p>
        <StarRating 
          readOnlyValue={seller?.rating} 
          id="seller-page-rating" 
          width={20}
          height={20}
        />
      </div>
      <TabsPageLayout
        tabsData={tabsData}
        pageContent={renderInnerPage()}
        doesHaveDynamicParam={true}
        isToUsePaddingForPage={type !== "devices"}
      />
    </main>
  );
});

export default SellerPage;
