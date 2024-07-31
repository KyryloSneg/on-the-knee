import MenuIconBtn from "./UI/menuIconBtn/MenuIconBtn";
import categoryBtnIcon from "../assets/category-button.svg";
import setCategoriesModalVisibility from "../utils/setCategoriesModalVisibility";
import { useContext, useRef } from "react";
import { Context } from "../Context";
import { WIDTH_TO_SHOW_CATEGORIES_MENU } from "../utils/consts";
import useWindowWidth from "../hooks/useWindowWidth";
import setCategoriesMenuVisibility from "../utils/setCategoriesMenuVisibility";
import setMenuVisibility from "../utils/setMenuVisibility";

const MenuCatalogBtn = () => {
  const { app } = useContext(Context);
  const windowWidth = useWindowWidth();
  const btnRef = useRef(null);
  
  function onClick() {
    if (windowWidth >= WIDTH_TO_SHOW_CATEGORIES_MENU) {
      setCategoriesMenuVisibility(true, app);
      setMenuVisibility(false, app, true);
    } else {
      app.setMenuCategoriesBtnRef(btnRef);
      setCategoriesModalVisibility(true, app);
    }
  }

  return (
    <MenuIconBtn 
      text="Catalog" 
      src={categoryBtnIcon} 
      aria-controls="categories-modal"
      onClick={onClick}
      ref={btnRef}
    />
  );
}

export default MenuCatalogBtn;
