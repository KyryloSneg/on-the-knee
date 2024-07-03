import "./CommentImagesSection.css";
import CustomScrollbar from '../customScrollbar/CustomScrollbar';

const CommentImagesSection = ({ images }) => {
  function onClick() {
    // set visibility of a comment's image modal to true
  }

  return (
    <CustomScrollbar
      children={
        <ul className="comment-images-section">
          {images.map((image, index) => {
            // { fileObj: "href", rotateDegrees: 0 } || "href"
            const src = typeof image === "object" ? image?.fileObj : image;

            return (
              <li key={index}>
              <button onClick={onClick}>
                <img 
                  src={src} 
                  alt="" 
                  draggable="false" 
                  style={{ transform: `rotate(${image?.rotateDegrees || 0}deg)` }} 
                />
              </button>
            </li>
            );
          })}
        </ul>
      }
    />
  );
}

export default CommentImagesSection;
