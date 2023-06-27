import { useContext } from "react";
import { Context } from "../index";
import UsedFilters from "./UsedFilters";
import { observer } from "mobx-react-lite";
import "./styles/Aside.css";
import FilterCategories from "./FilterCategories";

const Aside = observer(() => {
  const { deviceStore } = useContext(Context);

  return (
    <aside>
      {Object.keys(deviceStore.usedFilters).length > 0 && <UsedFilters />}
      <FilterCategories />
    </aside>
  );
});

export default Aside;
