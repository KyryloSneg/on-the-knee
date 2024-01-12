import { forwardRef, useContext } from "react";
import categoryBtnIcon from "../assets/category-button.svg";
import closeIcon from "../assets/close-24x24-w-400-white.svg";
import NavIconBtn from "./UI/navIconBtn/NavIconBtn";
import "./styles/NavCategoryBtn.css";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import setCategoriesMenuVisibility from "../utils/setCategoriesMenuVisibility";

const NavCategoryBtn = observer(forwardRef((props, ref) => {
  const { app } = useContext(Context);
  const src = app.isVisibleCategoriesMenu ? closeIcon : categoryBtnIcon;
  
  function onClick() {
    // Open / close category menu
    const isToShowMenu = !app.isVisibleCategoriesMenu;
    setCategoriesMenuVisibility(isToShowMenu, app);
  }

  return (
    <NavIconBtn
      src={src} text="Category"
      className="nav-category-button" 
      aria-controls="categories-menu"
      onClick={onClick}
      ref={ref}
    />
  );
}));

export default NavCategoryBtn;
