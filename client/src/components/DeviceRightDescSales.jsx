import DeviceRightDescSaleItem from "./DeviceRightDescSaleItem";
import "./styles/DeviceRightDescSales.css";

const DeviceRightDescSales = ({ salesAndTypes }) => {
  return (
    <section className="device-right-desc-sales-section">
      <ul className="device-right-desc-sales">
        {salesAndTypes.map((saleAndType, index) => 
          <li key={index}>
            <DeviceRightDescSaleItem 
              sale={saleAndType.sale} 
              saleTypes={saleAndType.saleTypes} 
            />
          </li>
        )}
      </ul>
    </section>
  );
}

export default DeviceRightDescSales;
