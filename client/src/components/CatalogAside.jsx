import { useContext } from "react";
import FiltersAside from "./FiltersAside";
import CustomScrollbar from "./UI/customScrollbar/CustomScrollbar";
import "./styles/CatalogAside.css";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";

const CatalogAside = observer(() => {
  const { deviceStore } = useContext(Context);

  return (
    <div className="filters-aside-wrapper">
      {(!!Object.keys(deviceStore.filters).length && !!deviceStore.devices.length) && <CustomScrollbar children={<FiltersAside />} className="filters-aside-scroll" />}
    </div>
  );
});

export default CatalogAside;
