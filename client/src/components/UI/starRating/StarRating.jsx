import "./StarRating.css";
import Star from "./Star";
import { useMemo, useState } from "react";
import { v4 } from "uuid";

// isWithText works only for 5-star rating
const StarRating = ({ 
  readOnlyValue = 0, id, maxValue = 5, size = 16, isWithText = false, 
  isReadOnly = true, areBtnsBlocked = false, settedValue = null, setSettedValue = null, onSetCb = null, ...props 
}) => {
  const [hoveredValue, setHoveredValue] = useState(settedValue);
  const starRatingInvisibleAltTextId = useMemo(() => v4(), []);

  let divProps = {};
  if (isReadOnly) {
    divProps["aria-labelledby"] = starRatingInvisibleAltTextId;
  } else {
    divProps.role = "radiogroup";
  }

  return (
    <div className="display-flex star-rating" {...divProps} {...props}>
      {isReadOnly && (
        <p className="visually-hidden" id={starRatingInvisibleAltTextId}>
          {readOnlyValue} {readOnlyValue === 1 ? "star" : "stars"} of {maxValue}
        </p>
      )}
      {[...Array(maxValue)].map((val, index) => {
        const starIndex = index + 1;
        const star = (
          <Star 
            value={hoveredValue || settedValue || readOnlyValue} 
            starIndex={starIndex} 
            size={size}
            /* key that will be passed to our svg elements */
            starKey={`device / seller ${id}: ${starIndex}`}
            /* real key to prevent react console error */
            key={`device / seller ${id}: ${starIndex}`}
          />
        );

        if (!isReadOnly) {
          let text;
          if (isWithText) {
            if (starIndex === 1) {
              text = "Terrible";
            } else if (starIndex === 2) {
              text = "So so";
            } else if (starIndex === 3) {
              text = "Fine";
            } else if (starIndex === 4) {
              text = "Good";
            } else if (starIndex === 5) {
              text = "Wonderful";
            }
          }

          function onClick() {
            setSettedValue(starIndex);
            setHoveredValue(null);

            if (onSetCb) onSetCb();
          }

          return (
            <button 
              type="button"
              disabled={areBtnsBlocked}
              onMouseEnter={() => setHoveredValue(starIndex)}
              onMouseLeave={() => setHoveredValue(null)}
              onClick={onClick}
              role="radio"
              aria-checked={+settedValue === starIndex}
              aria-label={`Select ${starIndex} star${starIndex > 1 ? "s" : ""}`}
              key={`device / seller star button ${id}: ${starIndex}`}
            >
              {star}
              {isWithText && <span>{text}</span>}
            </button>
          );
        } else {
          return star;
        }
        
      })}
    </div>
  );
}

export default StarRating;
