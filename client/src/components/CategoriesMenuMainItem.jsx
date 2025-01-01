import "./styles/CategoriesMenuMainItem.css"
import { Link } from "react-router-dom";
import getCategoryLinkTo from "../utils/getCategoryLinkTo";
import SkipToNextPageContent from "./UI/skipToNextPageContent/SkipToNextPageContent";
import itemIcon from "../assets/chevron_right_24x24-white.svg";

const POSSIBLE_TYPES = ["categoriesMenu", "mainPage"];

// setSelectedId and firstSecCategoryRef are used if type === "categoriesMenu"
const CategoriesMenuMainItem = ({ type, category, setSelectedId = null, firstSecCategoryRef = null }) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of CategoriesMenuMainItem is not defined or incorrect");
  const to = getCategoryLinkTo(category);

  function onClick(e) {
    // if the event has bubbled from the skip btn, do not navigate user to the corresponding category page
    // (for some reason i can't prevent event bubbling in the button)
    
    // if one of the elements below is focused, preventing navigate to the page
    // (there are their classNames)
    const elementsToPrevent = ["skip-to-next-page-content", "categories-menu-nest-2", "categories-menu-nest-3"];

    for (let className of elementsToPrevent) {
      if (document.activeElement.classList.contains(className)) {
        e.preventDefault();
        break;
      };
    }
  }

  let linkAdditionalProps = {};
  if (type === "categoriesMenu") {
    linkAdditionalProps = { 
      "onClick": onClick,
      "onPointerEnter": () => setSelectedId(category.id),
      "onFocus": () => setSelectedId(category.id),
      "data-id": category.id,
    }
  }

  return (
    <Link 
      to={to} 
      className="categories-menu-main-item"
      {...linkAdditionalProps}
    >
      <img src={category.icon} alt="" draggable="false" />
      <p>{category.name}</p>
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
      </svg>
      {type === "categoriesMenu" && (
        <SkipToNextPageContent 
          elemToFocus={firstSecCategoryRef} 
          iconSrc={itemIcon} iconAlt="Go into category"
        />
      )}
    </Link>
  );
}

export default CategoriesMenuMainItem;
