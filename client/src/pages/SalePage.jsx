import "./styles/SalePage.css";
import SalePageBanner from "components/SalePageBanner";
import useOneSaleFetching from "hooks/useOneSaleFetching";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "Context";
import CatalogPage from "./CatalogPage";
import { ROOT_ROUTE } from "utils/consts";
import useNavigateToEncodedURL from "hooks/useNavigateToEncodedURL";

const SalePage = observer(() => {
  const { oneSalePageStore, fetchRefStore } = useContext(Context);
  const { saleIdSlug } = useParams();
  const navigate = useNavigateToEncodedURL();

  const [id] = saleIdSlug.split("--");

  const hasAlreadyFetchedThisSale = (
    fetchRefStore.lastSalePageSaleFetchResult?.id === id
      ? fetchRefStore.lastSalePageSaleFetchResult
      : null
  );

  useOneSaleFetching(id, { isToFetch: !hasAlreadyFetchedThisSale, isSalePageFetch: true });
  if (!oneSalePageStore.sale) return;
  if (oneSalePageStore.sale?.hasEnded) {
    setTimeout(() => navigate(ROOT_ROUTE, { replace: true }, 0));
    return;
  };

  return (
    <div className="sale-page">
      <SalePageBanner sale={oneSalePageStore.sale} />
      <CatalogPage type="saleDevices" sale={oneSalePageStore.sale} />
    </div>
  );
});

export default SalePage;
