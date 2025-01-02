import CatalogPage from './CatalogPage';

const SellerDevicesPage = (({ seller }) => {
  if (!seller) return;
  
  return (
    <CatalogPage 
      type="seller" 
      seller={seller} 
    />
  );
});

export default SellerDevicesPage;
