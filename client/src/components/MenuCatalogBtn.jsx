import MenuIconBtn from "./UI/menuIconBtn/MenuIconBtn";
import categoryBtnIcon from "../assets/category-button.svg";
import setCategoriesModalVisibility from "../utils/setCategoriesModalVisibility";
import { useContext } from "react";
import { Context } from "../Context";
import { WIDTH_TO_SHOW_CATEGORIES_MENU } from "../utils/consts";
import useWindowWidth from "../hooks/useWindowWidth";
import setCategoriesMenuVisibility from "../utils/setCategoriesMenuVisibility";
import setMenuVisibility from "../utils/setMenuVisibility";

const MenuCatalogBtn = () => {
  const { app } = useContext(Context);
  const windowWidth = useWindowWidth();
  
  function onClick() {
    if (windowWidth >= WIDTH_TO_SHOW_CATEGORIES_MENU) {
      setCategoriesMenuVisibility(true, app);
      setMenuVisibility(false, app, true);
    } else {
      setCategoriesModalVisibility(true, app);
    }
  }

  return (
    <MenuIconBtn 
      text="Catalog" 
      src={categoryBtnIcon} 
      aria-controls="categories-modal"
      onClick={onClick}
    />
  );
}

export default MenuCatalogBtn;
