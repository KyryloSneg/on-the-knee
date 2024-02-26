import FiltersAside from "./FiltersAside";
import PreetyScrollbar from "./UI/preetyScrollbar/PreetyScrollbar";
import "./styles/CatalogAside.css";

const CatalogAside = () => {
  return (
    <div className="filters-aside-wrapper">
      <PreetyScrollbar children={<FiltersAside />} id={"filters-aside-scroll"} className="filters-aside-scroll" />
    </div>
  );
}

export default CatalogAside;
