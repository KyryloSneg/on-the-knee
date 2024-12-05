import "./styles/SellerPage.css";
import { useContext, useEffect, useRef, useState } from 'react';
import TabsPageLayout from '../components/UI/tabsPageLayout/TabsPageLayout';
import useOneSellerFetching from '../hooks/useOneSellerFetching';
import useOneSellerFeedbacksFetching from '../hooks/useOneSellerFeedbacksFetching';
import { SELLER_DEVICES_ROUTE, SELLER_FEEDBACKS_ROUTE, SELLER_ROUTE } from '../utils/consts';
import { useLocation, useParams } from 'react-router-dom';
import MainSellerPage from './MainSellerPage';
import SellerFeedbacksPage from './SellerFeedbacksPage';
import SellerDevicesPage from './SellerDevicesPage';
import { Context } from '../Context';
import { observer } from 'mobx-react-lite';
import StarRating from '../components/UI/starRating/StarRating';

const POSSIBLE_TYPES = ["main", "feedbacks", "devices"];
const SellerPage = observer(({ type }) => {
  const { deviceStore, fetchRefStore } = useContext(Context);
  const { sellerIdSlug } = useParams();
  const location = useLocation();
  const currentQueryParamsFromTheDevicesPage = useRef("?page=1&pagesToFetch=1")

  let [id] = sellerIdSlug.split("--");

  const initialSeller = (
    fetchRefStore.lastSellerPageSellerFetchResult?.id === id 
      ? fetchRefStore.lastSellerPageSellerFetchResult 
      : null
  );
  
  const [seller, setSeller] = useState(initialSeller);
  
  const hasAlreadyFetchedDevicesRef = useRef(false);
  const prevUsedFiltersRef = useRef({});
  const prevSortFilterRef = useRef(null);

  useOneSellerFetching(id, setSeller, !seller);
  useOneSellerFeedbacksFetching(seller?.id, null, false, true);

  useEffect(() => {
    if (seller) fetchRefStore.setLastSellerPageSellerFetchResult(seller);
  }, [fetchRefStore, seller]);

  useEffect(() => {
    if (type === "devices") currentQueryParamsFromTheDevicesPage.current = location.search;
  }, [type, location.search]);

  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Seller Page is not defined or incorrect");

  function renderInnerPage() {
    function getSortedByDateFeedbacks() {
      const sortedByDateFeedbacks = [...deviceStore.sellersFeedbacks].sort(
        (a, b) => b.date.localeCompare(a.date)
      );

      return sortedByDateFeedbacks
    }

    let innerPage;

    const hasAlreadyFetchedFeedbacks = (
      (
        fetchRefStore.lastSellerPageSellerIdWithFetchedFeedbacks !== null
        && fetchRefStore.lastSellerPageSellerIdWithFetchedFeedbacks !== undefined
      )
      && fetchRefStore.lastSellerPageSellerIdWithFetchedFeedbacks === seller?.id
    );

    if (type === "main") {
      innerPage = (
        <MainSellerPage 
          seller={seller} 
          feedbacks={hasAlreadyFetchedFeedbacks ? deviceStore.sellersFeedbacks || [] : []} 
        />
      );
    } else if (type === "feedbacks") {
      const feedbacks = getSortedByDateFeedbacks();
      innerPage = (
        <SellerFeedbacksPage 
          seller={seller} 
          feedbacks={hasAlreadyFetchedFeedbacks ? feedbacks : []} 
        />
      );
    } else if (type === "devices") {
      innerPage = (
        <SellerDevicesPage 
          seller={seller} 
          hasAlreadyFetchedDevicesRef={hasAlreadyFetchedDevicesRef} 
          prevUsedFiltersRef={prevUsedFiltersRef} 
          prevSortFilterRef={prevSortFilterRef}
        />
      );
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
    { 
      children: "Devices", 
      to: SELLER_DEVICES_ROUTE.replace(":sellerIdSlug", sellerIdSlug) + currentQueryParamsFromTheDevicesPage.current 
    },
  ];

  return (
    <main className="seller-page">
      {seller && (
        <>
          <h2 className="top-h2">
            Seller {seller?.name}
          </h2>
          <div className="seller-page-rating-wrap">
            <p>
              {seller?.rating}
            </p>
            <StarRating 
              readOnlyValue={seller?.rating} 
              id="seller-page-rating" 
              size={20}
            />
          </div>
          <TabsPageLayout
            tabsData={tabsData}
            pageContent={renderInnerPage()}
            doesHaveDynamicParam={true}
            isToUsePaddingForPage={type !== "devices"}
          />
        </>
      )}
    </main>
  );
});

export default SellerPage;
