import "./styles/SalesList.css";
import SaleItem from "./SaleItem";

const SalesList = ({ sales }) => {
  return (
    <ul className="sales-list">
      {sales.map(sale => 
        <li key={sale.id}>
          <SaleItem sale={sale} />
        </li>
      )}
    </ul>
  );
}

export default SalesList;
