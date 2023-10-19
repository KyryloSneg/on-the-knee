import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom';
import URLActions from '../../../utils/URLActions';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../Context';
import "./ButtonPagination.css";

const ButtonPagination = observer(({ isLoading, className }) => {
  const { deviceStore } = useContext(Context);
  const to = URLActions.setNewParam("pagesToFetch", deviceStore.pagesToFetch + 1);

  return (
    <Link to={to} className={`btn-pagination ${className}`}>
      {/* turning on animation on click */}
      <Spinner
        animation="border"
        variant="primary"
        size="sm"
        role="status"
        className={isLoading ? "no-select" : "no-select not-active"}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p>Show more devices?</p>
    </Link>
  );
})

export default ButtonPagination;
