import { forwardRef, useContext } from "react";
import { nextAddedFilters, nextRemovedFilters } from "../utils/filterFunctions";
import "./styles/CategoryFilter.css";
import { Context } from "../Context";

const CategoryFilter = forwardRef(({ filter, value, active, onKeyDown, testId }, ref) => {
  const { deviceStore } = useContext(Context);
  const className = active ? "filter-icon checked" : "filter-icon";
  const iconTestId = active ? testId + " - icon checked" : testId + " - icon";

  function onClick() {
    let next;

    if (active) {
      next = nextRemovedFilters(deviceStore.usedFilters, filter, value);
    } else {
      next = nextAddedFilters(deviceStore.usedFilters, filter, value);
    }

    deviceStore.setUsedFilters(next);
  }

  return (
    <button 
      onClick={onClick} 
      onKeyDown={onKeyDown}
      role="checkbox"
      aria-checked={active ? "true" : "false"}
      ref={ref}
      data-testid={testId}
    >
      <div className={className} aria-hidden="true" data-testid={iconTestId} />
      <p>{value[0].toUpperCase() + value.slice(1)}</p>
    </button>
  );
});

export default CategoryFilter;
