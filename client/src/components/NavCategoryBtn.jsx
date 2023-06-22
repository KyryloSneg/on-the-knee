import categoryBtnIcon from "../assets/category-button.svg";
import "./styles/NavCategoryBtn.css";

const NavCategoryBtn = () => {

  function onClick() {
    // Open category menu
  }

  return (
    <button className="nav-mini-button nav-category-button" onClick={onClick}>
      <span>Category</span>
      <img src={categoryBtnIcon} className="no-select" draggable="false" alt="Category" />
    </button>
  );
}

export default NavCategoryBtn;
