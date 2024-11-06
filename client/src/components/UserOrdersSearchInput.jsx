import "./styles/UserOrdersSearchInput.css";
import { useState } from "react";
import DeleteInputContent from "./UI/deleteInputContent/DeleteInputContent";
import getPreparedForMockServerStr from "../utils/getPreparedForMockServerStr";
import { USER_ORDERS_ROUTE, WIDTH_TO_SHOW_USER_ORDERS_SEARCH_DESKTOP_VERSION } from "../utils/consts";
import useNavigateToEncodedURL from "../hooks/useNavigateToEncodedURL";
import UIButton from "./UI/uiButton/UIButton";
import URLActions from "../utils/URLActions";
import useWindowWidth from "../hooks/useWindowWidth";

const UserOrdersSearchInput = ({ sortedOrders, initialOrders }) => {
  const windowWidth = useWindowWidth();
  const navigate = useNavigateToEncodedURL();
  const [query, setQuery] = useState(getPreparedForMockServerStr(URLActions.getParamValue("orderQuery") || ""));

  function onInputEmptyValue() {
    const orderQuery = URLActions.getParamValue("orderQuery");
    
    if (sortedOrders?.length || (orderQuery && initialOrders?.length)) {
      // if user has filtered orders and deleted the input's content,
      // reset the orderQuery param
      if (orderQuery) {
        const url = URLActions.deleteParamValue("orderQuery", orderQuery);
        const basename = process.env.REACT_APP_CLIENT_URL;

        navigate(url.replace(basename, ""));
      };
    };
  }

  function onChange(e) {
    if (e.target.value === "") onInputEmptyValue();
    setQuery(e.target.value);
  };

  function onDeleteInputContentClick() {
    onInputEmptyValue();
    setQuery("");
  };

  function onSubmit(e) {
    e.preventDefault(e);

    if (!!query.trim().length) {
      const hrefQuery = getPreparedForMockServerStr(query.trim()).replaceAll("&", "%2526");
      const queryFromURL = URLActions.getParamValue("orderQuery")

      if (hrefQuery !== queryFromURL) {
        const href = USER_ORDERS_ROUTE + `?orderQuery=${hrefQuery}`;
        navigate(href);
      }
    };
  };

  return (
    <form className="user-orders-search-input-form" onSubmit={onSubmit}>
      <div className="user-orders-search-input-wrapper">
        <input 
          type="search" 
          placeholder="Order search"
          aria-label="Search your order"
          autoComplete="off"
          value={query}
          onChange={onChange}
        />
        <DeleteInputContent onClick={onDeleteInputContentClick} />
      </div>
      {windowWidth >= WIDTH_TO_SHOW_USER_ORDERS_SEARCH_DESKTOP_VERSION && (
        <UIButton type="submit" variant="modal-submit" disabled={!query.trim().length}>
          Search
        </UIButton>
      )}
    </form>
  );
}

export default UserOrdersSearchInput;
