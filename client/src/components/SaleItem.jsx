import "./styles/SaleItem.css";
import getDateStr from "utils/getDateStr";
import { Link } from "react-router-dom";
import getDatetime from "utils/getDatetime";
import { SALE_ROUTE } from "utils/consts";
import getDateDiffInDays from "utils/getDateDiffInDays";

const SaleItem = ({ sale }) => {
  const createdAtDate = new Date(sale.createdAt);
  const expiresAtDate = new Date(sale.expiresAt);

  const createdAtStr = getDateStr(createdAtDate, "MMM Do");
  const createdAtDatetime = getDatetime(createdAtDate);

  const expiresAtStr = getDateStr(expiresAtDate, "MMM Do YYYY");
  const expiresAtDatetime = getDatetime(expiresAtDate);

  const to = SALE_ROUTE + `${sale.id}--${sale.slug}`;
  const remainingTimeInDays = getDateDiffInDays(createdAtDate, expiresAtDate);
  const doesSaleLastOnlyToday = !remainingTimeInDays;

  return (
    <Link to={to} className="sale-item-wrapper">
      <section className="sale-item">
        <img src={sale.thumbnail} alt="" />
        <div className="sale-item-bottom-bar">
          <div>
            <p className="sale-item-time-range">
              From
              <time dateTime={createdAtDatetime}>
                <strong> {createdAtStr} </strong>
              </time>
              to
              <time dateTime={expiresAtDatetime}>
                <strong> {expiresAtStr}</strong>
              </time>
            </p>
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
