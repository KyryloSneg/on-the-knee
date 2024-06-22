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
          {images.map((src, index) =>
            <li key={index}>
              <button onClick={onClick}>
                <img src={src} alt="" draggable="false" />
              </button>
            </li>
          )}
        </ul>
      }
    />
  );
}

export default CommentImagesSection;
