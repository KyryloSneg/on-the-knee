import { useState } from 'react';
import TabsPageLayout from '../components/UI/tabsPageLayout/TabsPageLayout';
import useOneSellerFetching from '../hooks/useOneSellerFetching';
import useOneSellerFeedbacksFetching from '../hooks/useOneSellerFeedbacksFetching';
import { SELLER_DEVICES_ROUTE, SELLER_FEEDBACKS_ROUTE, SELLER_ROUTE } from '../utils/consts';
import { useParams } from 'react-router-dom';
import MainSellerPage from './MainSellerPage';
import SellerFeedbacksPage from './SellerFeedbacksPage';
import SellerDevicesPage from './SellerDevicesPage';

const POSSIBLE_TYPES = ["main", "feedbacks", "devices"];
const SellerPage = ({ type }) => {
  const { sellerIdSlug } = useParams();
  const [seller, setSeller] = useState(null);
  const [sellerFeedbacks, setSellerFeedbacks] = useState(null);

  let [id] = sellerIdSlug.split("--");
  id = +id;

  useOneSellerFetching(id, setSeller);
  useOneSellerFeedbacksFetching(seller?.id, setSellerFeedbacks);

  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Seller Page is not defined or incorrect");

  function renderInnerPage() {
    let innerPage;

    if (type === "main") {
      innerPage = <MainSellerPage seller={seller} feedbacks={sellerFeedbacks} />;
    } else if (type === "feedbacks") {
      innerPage = <SellerFeedbacksPage seller={seller} feedbacks={sellerFeedbacks} />;
    } else if (type === "devices") {
      innerPage = <SellerDevicesPage seller={seller} />;
    }

    return innerPage;
  }

  const tabsData = [
    { name: "Everything about seller", to: SELLER_ROUTE + sellerIdSlug },
    { name: 
      `Comments (${sellerFeedbacks?.length || 0})`, 
      to: SELLER_FEEDBACKS_ROUTE.replace(":sellerIdSlug", sellerIdSlug) 
    },
    { name: "Devices", to: SELLER_DEVICES_ROUTE.replace(":sellerIdSlug", sellerIdSlug) },
  ];

  return (
    <main>
      <TabsPageLayout tabsData={tabsData} pageContent={renderInnerPage()} />
    </main>
  );
}

export default SellerPage;
