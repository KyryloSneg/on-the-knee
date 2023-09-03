import categoryBtnIcon from "../assets/category-button.svg";
import NavIconBtn from "./UI/navIconBtn/NavIconBtn";
import "./styles/NavCategoryBtn.css";

const NavCategoryBtn = () => {

  function onClick() {
    // Open category menu
  }

  return (
    <NavIconBtn 
      src={categoryBtnIcon} text="Category"
      className="nav-category-button" onClick={onClick}
    />
  );
}

export default NavCategoryBtn;
