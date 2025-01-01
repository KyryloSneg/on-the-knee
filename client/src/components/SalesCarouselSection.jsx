import "./styles/SalesCarouselSection.css";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { ALL_SALES_SLUG, SALE_ROUTE, SALES_ROUTE } from "utils/consts";
import ImagesCarousel from "./UI/imagesCarousel/ImagesCarousel";
import { useContext } from "react";
import { Context } from "Context";

const SalesCarouselSection = observer(() => {
  const { deviceStore } = useContext(Context);

  let salesToShowThumbnails;
  let hasFetchedSalesSuccessfully = true;

  if (deviceStore.hasTriedToFetchSales) {
    salesToShowThumbnails = deviceStore.sales?.slice(0, 10).map(sale => {
      const thumbnail = sale?.thumbnail;
      const to = SALE_ROUTE + `${sale?.id}--${sale?.slug}?page=1&pagesToFetch=1`;
  
      if (!thumbnail || !to) hasFetchedSalesSuccessfully = false;
      return { src: thumbnail, alt: sale?.alt || "", to: to };
    });
  }

  if (
    !deviceStore.hasTriedToFetchSales 
    || !hasFetchedSalesSuccessfully 
    || !salesToShowThumbnails?.length
  ) return;
  
  return (
    <div className="sales-carousel-section">
      <ImagesCarousel images={salesToShowThumbnails} className="sales-images-carousel" />
      <Link to={SALES_ROUTE + ALL_SALES_SLUG + "?page=1&pagesToFetch=1"} className="link-colors">
        All sales
      </Link>
    </div>
  );
});

export default SalesCarouselSection;
