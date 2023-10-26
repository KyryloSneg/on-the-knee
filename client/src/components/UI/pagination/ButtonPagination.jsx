import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom';
import URLActions from '../../../utils/URLActions';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../Context';
import "./ButtonPagination.css";
import useWindowWidth from '../../../hooks/useWindowWidth';
import { WIDTH_TO_SHOW_LOADING_BTN_PAGINATION } from '../../../utils/consts';

const ButtonPagination = observer(({ isLoading, className = "" }) => {
  const { deviceStore } = useContext(Context);
  const screenWidth = useWindowWidth();

  if (screenWidth < WIDTH_TO_SHOW_LOADING_BTN_PAGINATION && isLoading) {
    return (
      <Spinner
        animation="border"
        variant="primary"
        size="sm"
        role="status"
        className="no-select pagination-btn-mobile-loader"
      />
    );
  }

  const to = !isLoading ? URLActions.setNewParam("pagesToFetch", deviceStore.pagesToFetch + 1) : null;
  const disabledClassName = !to ? "disabled-link" : "";
  const spinnerClassName = isLoading ? "no-select" : "no-select placeholder";

  return (
    <Link to={to} className={`btn-pagination ${disabledClassName} ${className}`}>
      {/* turning on animation on click */}
      <Spinner
        animation="border"
        variant="primary"
        size="sm"
        role="status"
        className={spinnerClassName}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p>Show more devices?</p>
    </Link>
  );
})

export default ButtonPagination;
