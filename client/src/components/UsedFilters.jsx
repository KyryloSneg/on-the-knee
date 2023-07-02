import { observer } from "mobx-react-lite";
import FiltersList from "./FiltersList";
import "./styles/UsedFilters.css";

const UsedFilters = observer(() => {
  return (
    <section className="used-filters" data-testid="used-filters-section">
      <h2>Used filters</h2>
      <FiltersList />
    </section>
  );
});

export default UsedFilters;
