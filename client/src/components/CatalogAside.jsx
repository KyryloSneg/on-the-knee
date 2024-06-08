import FiltersAside from "./FiltersAside";
import CustomScrollbar from "./UI/customScrollbar/CustomScrollbar";
import "./styles/CatalogAside.css";
import { observer } from "mobx-react-lite";

const CatalogAside = observer(() => {
  return (
    <div className="filters-aside-wrapper">
      <CustomScrollbar children={<FiltersAside />} className="filters-aside-scroll" />
    </div>
  );
});

export default CatalogAside;
