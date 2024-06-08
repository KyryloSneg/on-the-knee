import { Link } from "react-router-dom";
import "./styles/DeviceRightDescSaleItem.css";
import { SALES_ROUTE } from "../utils/consts";
import moment from "moment";

const DeviceRightDescSaleItem = ({ sale, saleTypes }) => {
  const to = SALES_ROUTE + `/${sale.slug}`;

  const createdAtDate = new Date(sale.createdAt);
  const expiresAtDate = new Date(sale.expiresAt);

  function getFormattedDateString(date) {
    function switchDayAndMonth(dateStr) {
      const day = dateStr.slice(0, 2);
      const month = dateStr.slice(3, 5);
      const year = dateStr.slice(6, 10);

      const result = `${month}.${day}.${year}`
      return result;
    }

    const localeDateString = date.toLocaleDateString();
    const formattedDateString = switchDayAndMonth(localeDateString);

    return formattedDateString;
  }

  const createdAtStr = moment(new Date(getFormattedDateString(createdAtDate))).format("MMM Do");
  const expiresAtStr = moment(new Date(getFormattedDateString(expiresAtDate))).format("MMM Do YYYY");
  // d.toLocaleDateString() + moment.js
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
        <p>From <strong>{createdAtStr}</strong> to <strong>{expiresAtStr}</strong></p>
      </div>
    </section>
  );
}

export default DeviceRightDescSaleItem;
