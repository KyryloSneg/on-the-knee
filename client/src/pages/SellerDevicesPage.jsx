import CatalogPage from './CatalogPage';

const SellerDevicesPage = (({ seller }) => {
  if (!seller) return <div />;
  
  return (
    <CatalogPage 
      type="seller" 
      seller={seller} 
    />
  );
});

export default SellerDevicesPage;
