import "./ButtonPagination.css";
import { Link } from 'react-router-dom';
import URLActions from '../../../utils/URLActions';
import useWindowWidth from '../../../hooks/useWindowWidth';
import { WIDTH_TO_SHOW_LOADING_BTN_PAGINATION } from '../../../utils/consts';
import Loader from "../loader/Loader";

const ButtonPagination = ({ isLoading, pagesToFetch, className = "" }) => {
  const screenWidth = useWindowWidth();

  if (screenWidth < WIDTH_TO_SHOW_LOADING_BTN_PAGINATION && isLoading) {
    return (
      <Loader className="no-select pagination-btn-mobile-loader" />
    );
  }

  const to = !isLoading ? URLActions.setNewParam("pagesToFetch", pagesToFetch + 1) : null;
  const disabledClassName = !to ? "disabled-link" : "";
  const spinnerClassName = isLoading ? "no-select" : "no-select placeholder";

  return (
    <Link to={to} className={`btn-pagination ${disabledClassName} ${className}`} preventScrollReset={true}>
      {/* turning on animation on click */}
      <Loader className={spinnerClassName} />
      <p>Show more devices?</p>
    </Link>
  );
}

export default ButtonPagination;
