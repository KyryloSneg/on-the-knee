import { useContext } from "react";
import { Context } from "../index";
import UsedFilters from "./UsedFilters";
import { observer } from "mobx-react-lite";
import "./styles/Aside.css";

const Aside = observer(() => {
  const { filtersStore } = useContext(Context);
  
  return (
    <aside>
      {Object.keys(filtersStore.filters).length > 0 && <UsedFilters />}
    </aside>
  );
});

export default Aside;
