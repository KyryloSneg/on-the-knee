import "./styles/FilterBtn.css";
import removeIcon from "../assets/remove.svg";
import URLActions from "../utils/URLActions";
import { Link } from "react-router-dom";

const FilterBtn = ({ value, paramKey, testId }) => {
  let to = URLActions.deleteParamValue(paramKey, value);
  to = URLActions.getURLWithResettedPageRelatedParams(to);
  
  let priceFilterInvisibleText = null;
  if (paramKey === "price") {
    const [minValue, maxValue] = value?.split("-");

    // just in case
    if (minValue && maxValue) {
      priceFilterInvisibleText = `From ${minValue}$ to ${maxValue}$`;
    }
  }

  let className = "remove-filter";

  const isToRenderPriceInvisibleText = !!priceFilterInvisibleText && typeof priceFilterInvisibleText === "string";
  if (isToRenderPriceInvisibleText) {
    className = "remove-filter with-invisible-text";
  }

  return (
    <Link to={to} className={className} data-testid={testId} preventScrollReset={true}>
      {isToRenderPriceInvisibleText && (
        <span className="visually-hidden">{priceFilterInvisibleText}</span>
      )}
      <span aria-hidden={isToRenderPriceInvisibleText}>
        {paramKey !== "price" ? value : `${value}$`}
      </span>
      <img src={removeIcon} className="no-select" draggable="false" alt="" />
    </Link>
  );
}

export default FilterBtn;
