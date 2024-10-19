import "./styles/AdditionalServicesExpandedListItem.css";
import { Link } from 'react-router-dom';
import arrowOutward from "../assets/arrow_outward_5a5a5a.svg";
import { forwardRef } from "react";
import onRadioKeyDown from "../utils/onRadioKeyDown";

const AdditionalServicesExpandedListItem = forwardRef(({ 
  additionalServiceOption, isChecked, onCheck,
  checkNext, checkPrev, name, to, isReadOnly 
}, ref) => {
  let radioClassName = "radio-div";
  if (isChecked) {
    radioClassName += " checked";
  }

  return (
    <div className="additional-services-expanded-list-item">
      <button
        type="button"
        aria-checked={isChecked}
        role="radio"
        onClick={onCheck}
        onKeyDown={(e) => onRadioKeyDown(e, checkPrev, checkNext)}
        disabled={isReadOnly}
        ref={ref}
      >
        <div className="add-service-radio-div-wrapper">
          <div className={radioClassName} />
          <img
            src={additionalServiceOption.images[0].src}
            alt=""
            className="additional-service-image"
            draggable="false"
          />
        </div>
        <div className="add-service-name-price-wrapper">
          <span className="hidden-overflow-name">
            {name}
          </span>
          <strong className="additional-service-expanded-price">
            {additionalServiceOption.price}$
          </strong>
        </div>
      </button>
      <Link to={to}>
        <img
          src={arrowOutward}
          alt="Link to service's page"
          draggable="false"
        />
      </Link>
    </div>
  );
});

export default AdditionalServicesExpandedListItem;
