import "./styles/SalePageBanner.css";
import TimeRange from "./TimeRange";
import UITimer from "./UI/uiTimer/UITimer";

const SalePageBanner = ({ sale }) => {
  const createdAtDate = new Date(sale.createdAt);
  const expiresAtDate = new Date(sale.expiresAt);

  const untilTheEndDtElemId = "sale-page-banner-until-the-end-dt";

  return (
    <header className="sale-page-banner">
      <figure className="sale-page-banner-img-wrapper">
        <img src={sale.thumbnail} alt="" draggable="false" />
      </figure>
      <div className="sale-page-banner-sale-info">
        <h2>
          {sale.name}
        </h2>
        <dl className="sale-page-banner-info-list">
          <div>
            <dt id={untilTheEndDtElemId}>Until the end:</dt>
            <dd>
              <UITimer deadlineDate={expiresAtDate} aria-labelledby={untilTheEndDtElemId} />
            </dd>
          </div>
          <div>
            <dt>Sale duration:</dt>
            <dd>
              <TimeRange createdAtDate={createdAtDate} expiresAtDate={expiresAtDate} startWithCapitalLetter={false} />
            </dd>
          </div>
        </dl>
      </div>
    </header>
  );
}

export default SalePageBanner;
