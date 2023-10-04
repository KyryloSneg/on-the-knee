import desiredListIcon from "../assets/favorite.svg";
import "./styles/AddToDesiredListBtn.css";

const AddToDesiredListBtn = () => {

  function onClick() {
    // TODO: add to desired list
  }
  
  return (
    <button className="add-to-desired-list" onClick={onClick}>
      <img src={desiredListIcon} alt="Add to desired list" draggable="false" />
    </button>
  );
}

export default AddToDesiredListBtn;
