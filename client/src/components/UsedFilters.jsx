import { observer } from "mobx-react-lite";
import FiltersList from "./FiltersList";
import "./styles/UsedFilters.css";

const UsedFilters = observer(({ isSidebarVersion = false }) => {
  let className = "used-filters";
  if (isSidebarVersion) {
    className += ` sidebar-version`;
  }

  return (
    <section className={className} data-testid="used-filters-section">
      {!isSidebarVersion && <h2>Used filters</h2>}
      <FiltersList />
    </section>
  );
});

export default UsedFilters;
