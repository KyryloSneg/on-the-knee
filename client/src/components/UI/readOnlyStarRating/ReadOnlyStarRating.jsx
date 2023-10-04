import ReadOnlyStar from "./ReadOnlyStar";
import "./ReadOnlyStarRating.css";

const ReadOnlyStarRating = ({ value = 0, id, maxValue = 5, width = 16, height = 16 }) => {
  return (
    <div className="display-flex read-only-star-rating">
      {[...Array(maxValue)].map((val, index) => {
        const starIndex = index + 1;
        return (
          <ReadOnlyStar 
            value={value} 
            starIndex={starIndex} 
            width={width} 
            height={height}
            /* key that will be passed to our svg elements */
            starKey={`device / seller ${id}: ${starIndex}`}
            /* real key to prevent react console error */
            key={`device / seller ${id}: ${starIndex}`}
          />
        );
      })}
    </div>
  );
}

export default ReadOnlyStarRating;
