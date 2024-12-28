import "./styles/SalesPageList.css";
import { Context } from "Context";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import SalesList from "./SalesList";
import useGettingPagesObj from "hooks/useGettingPagesObj";

const SalesPageList = observer(() => {
  const { salesPageStore } = useContext(Context);
  const pagesObj = useGettingPagesObj(
    salesPageStore.filteredSales, salesPageStore.page, salesPageStore.pagesToFetch, salesPageStore.limit
  );

  return (
    <ul className="sales-page-list">
      {Object.entries(pagesObj).map(([key, value]) =>
        <li key={key}>
          <SalesList sales={value} />
        </li>
      )}
    </ul>
  );
});

export default SalesPageList;
