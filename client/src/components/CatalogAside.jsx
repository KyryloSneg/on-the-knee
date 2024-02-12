import FiltersAside from "./FiltersAside";
import PreetyScrollbar from "./UI/preetyScrollbar/PreetyScrollbar";
import "./styles/CatalogAside.css";

const CatalogAside = () => {
  return <PreetyScrollbar children={
    <div className="filters-aside-wrapper">
      <FiltersAside />
    </div>
  }/>
}

export default CatalogAside;
