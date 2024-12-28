import "./styles/DeviceRightDescSaleItem.css";
import { Link } from "react-router-dom";
import { SALE_ROUTE } from "../utils/consts";
import TimeRange from "./TimeRange";

const DeviceRightDescSaleItem = ({ sale, saleTypes }) => {
  const to = SALE_ROUTE + `${sale.id}--${sale.slug}?page=1&pagesToFetch=1`;

  const createdAtDate = new Date(sale.createdAt);
  const expiresAtDate = new Date(sale.expiresAt);
  
  return (
    <section className="device-right-desc-sale-item">
      <ul className="device-right-desc-sale-types">
        {saleTypes.map((type, index) => {
          const isLogo = !!type.logo;
          return isLogo
            ? (
              <li key={index}>
                <img src={type.logo} alt="" />
              </li>
            )
            : (
              <li key={index}>
                <div
                  className="device-right-desc-sale-text-wrap"
                  style={{ backgroundColor: type.bgColor }}
                >
                  <p>{type.text}</p>
                </div>
              </li>
            )
        })}
      </ul>
      <div className="device-right-desc-sale-link-date-wrap">
        <Link to={to} className="link-colors">
          {sale.description}
        </Link>
        <TimeRange createdAtDate={createdAtDate} expiresAtDate={expiresAtDate} />
      </div>
    </section>
  );
}

export default DeviceRightDescSaleItem;
