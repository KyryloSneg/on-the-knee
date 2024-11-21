import "./styles/CatalogAside.css";
import FiltersAside from "./FiltersAside";
import CustomScrollbar from "./UI/customScrollbar/CustomScrollbar";

const CatalogAside = () => {
  return (
    <div className="filters-aside-wrapper">
      <CustomScrollbar children={<FiltersAside />} className="filters-aside-scroll" />
    </div>
  );
};

export default CatalogAside;
