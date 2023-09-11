import { forwardRef } from "react";
import "./styles/CategoryFilter.css";
import { Link } from "react-router-dom";
import URLActions from "../utils/URLActions";

const CategoryFilter = forwardRef(({ filter, value, active, onKeyDown, testId }, ref) => {
  const to = active ? URLActions.deleteParamValue(filter, value) : URLActions.addParamValue(filter, value);
  const className = active ? "filter-icon checked" : "filter-icon";
  const iconTestId = active ? testId + " - icon checked" : testId + " - icon";

  return (
    <Link 
      to={to}
      onKeyDown={onKeyDown}
      role="checkbox"
      aria-checked={active ? "true" : "false"}
      ref={ref}
      data-testid={testId}
    >
      <div className={className} aria-hidden="true" data-testid={iconTestId} />
      <p>{value[0].toUpperCase() + value.slice(1)}</p>
    </Link>
  );
});

export default CategoryFilter;
