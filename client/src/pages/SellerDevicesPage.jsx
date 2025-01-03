import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";
import CatalogPage from './CatalogPage';

const SellerDevicesPage = (({ seller }) => {
  useSettingDocumentTitle(`Devices of ${seller?.name || "..."}`);
  if (!seller) return;
  
  return (
    <CatalogPage 
      type="seller" 
      seller={seller} 
    />
  );
});

export default SellerDevicesPage;
