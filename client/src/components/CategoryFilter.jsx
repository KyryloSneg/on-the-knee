import { forwardRef } from "react";
import "./styles/CategoryFilter.css";
import { Link } from "react-router-dom";
import URLActions from "../utils/URLActions";

const CategoryFilter = forwardRef(({ filter, value, count, active, onKeyDown, testId }, ref) => {
  // if the name of our filter is "color", do not include color's HEX part in the value 
  value = filter === "color" ? value.split("_")[0] : value;

  let to = "#";
  if (active) {
    to = URLActions.deleteParamValue(filter, value);
    to = URLActions.getURLWithResettedPageRelatedParams(to);
  } else {
    to = URLActions.addParamValue(filter, value);
    to = URLActions.getURLWithResettedPageRelatedParams(to);
  }
  
  const className = active ? "checkbox-div checked" : "checkbox-div";
  const iconTestId = active ? testId + " - icon checked" : testId + " - icon";

  return (
    <Link
      to={to}
      className="category-filter-link"
      onKeyDown={onKeyDown}
      role="checkbox"
      aria-checked={active ? "true" : "false"}
      ref={ref}
      data-testid={testId}
      preventScrollReset={true}
    >
      <div className={className} aria-hidden="true" data-testid={iconTestId} />
      <p>{value[0].toUpperCase() + value.slice(1)}</p>
      <span aria-label={`${count} devices`} className="filter-devices-amount">
        ({count})
      </span>
    </Link>
  );
});

export default CategoryFilter;
