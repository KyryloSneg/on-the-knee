import "./StarRating.css";
import Star from "./Star";
import { useState } from "react";

// isWithText works only for 5-star rating
const StarRating = ({ 
  readOnlyValue = 0, id, maxValue = 5, width = 16, height = 16, isWithText = false, 
  isReadOnly = true, areBtnsBlocked = false, settedValue = null, setSettedValue = null, onSetCb = null 
}) => {
  const [hoveredValue, setHoveredValue] = useState(settedValue);

  return (
    <div className="display-flex star-rating">
      {[...Array(maxValue)].map((val, index) => {
        const starIndex = index + 1;
        const star = (
          <Star 
            value={hoveredValue || settedValue || readOnlyValue} 
            starIndex={starIndex} 
            width={width} 
            height={height}
            /* key that will be passed to our svg elements */
            starKey={`device / seller ${id}: ${starIndex}`}
            /* real key to prevent react console error */
            key={`device / seller ${id}: ${starIndex}`}
          />
        );

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

        if (!isReadOnly) {
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