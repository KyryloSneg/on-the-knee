import "./styles/SaleItem.css";
import { Link } from "react-router-dom";
import { SALE_ROUTE } from "utils/consts";
import DateActions from "utils/DateActions";
import TimeRange from "./TimeRange";

const SaleItem = ({ sale }) => {
  const createdAtDate = new Date(sale.createdAt);
  const expiresAtDate = new Date(sale.expiresAt);

  const to = SALE_ROUTE + `${sale.id}--${sale.slug}?page=1&pagesToFetch=1`;
  const remainingTimeInDays = DateActions.getDateDiffInDays(createdAtDate, expiresAtDate);
  const doesSaleLastOnlyToday = !remainingTimeInDays;

  return (
    <Link to={to} className="sale-item-wrapper">
      <section className="sale-item">
        <img src={sale.thumbnail} alt="" draggable="false" />
        <div className="sale-item-bottom-bar">
          <div>
            <TimeRange createdAtDate={createdAtDate} expiresAtDate={expiresAtDate} className="sale-item-time-range" />
            <header className="sale-item-header">
              <h3 className="link-colors">{sale.name}</h3>
            </header>
          </div>
          <p className={"sale-item-remaining-time-p" + (doesSaleLastOnlyToday ? " only-today" : "")}>
            {doesSaleLastOnlyToday
              ? "Only today"
              : (
                <>Remaining <span>{remainingTimeInDays}</span> <span className="visually-hidden">days</span></>
              )
            }
          </p>
        </div>
      </section>
    </Link>
  );
}

export default SaleItem;
