import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";
import CatalogPage from './CatalogPage';
import MetaTagsInPublicRoute from "components/MetaTagsInPublicRoute";

const SellerDevicesPage = (({ seller }) => {
  useSettingDocumentTitle(`Devices of ${seller?.name || "..."}`);
  if (!seller) return;
  
  return (
    <>
      <MetaTagsInPublicRoute 
        description={`Devices of the seller ${seller?.name} in On the knee store. Favorable prices $, huge discounts %, sales`} 
        keywords={`seller, ${seller?.name}, devices, catalog`} 
        isToRender={seller?.name}
      />
      <CatalogPage 
        type="seller" 
        seller={seller} 
      />
    </>
  );
});

export default SellerDevicesPage;
