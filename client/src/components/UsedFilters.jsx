import { observer } from "mobx-react-lite";
import FiltersList from "./FiltersList";
import "./styles/UsedFilters.css";

const UsedFilters = observer(() => {
  return (
    <section className="used-filters">
      <h2>Used filters</h2>
      <FiltersList />
    </section>
  );
});

export default UsedFilters;
