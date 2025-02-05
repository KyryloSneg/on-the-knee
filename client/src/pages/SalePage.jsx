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
import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";
import ApiError from "utils/ApiError";
import MetaTagsInPublicRoute from "components/MetaTagsInPublicRoute";

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

  const [, , saleFetchingError] = useOneSaleFetching(id, { isToFetch: !hasAlreadyFetchedThisSale, isSalePageFetch: true });
  // i don't want to show the name of the previously fetched sale in the title

  const possibleSaleName = oneSalePageStore.sale?.name;
  useSettingDocumentTitle(hasAlreadyFetchedThisSale ? possibleSaleName || "..." : "...");

  if (!oneSalePageStore.sale && saleFetchingError?.response?.status === 404) throw ApiError.NotFoundError();

  if (!oneSalePageStore.sale) return;
  if (oneSalePageStore.sale?.hasEnded) {
    setTimeout(() => navigate(ROOT_ROUTE, { replace: true }, 0));
    return;
  };

  return (
    <div className="sale-page">
      <MetaTagsInPublicRoute 
        description={`Devices of ${possibleSaleName}. Favorable prices $ in On the knee store`} 
        keywords={`sale, devices, ${possibleSaleName}`}
        isToRender={hasAlreadyFetchedThisSale && possibleSaleName}
      />
      <SalePageBanner sale={oneSalePageStore.sale} />
      <CatalogPage type="saleDevices" sale={oneSalePageStore.sale} />
    </div>
  );
});

export default SalePage;
