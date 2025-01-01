import "./styles/CategoriesMenuMain.css"
import { forwardRef, useContext, useRef } from "react";
import { Context } from "../Context";
import CategoriesMenuMainItem from "./CategoriesMenuMainItem";
import SkipToNextPageContent from "./UI/skipToNextPageContent/SkipToNextPageContent";
import useFocusTraps from "../hooks/useFocusTraps";
import returnBackIcon from "../assets/arrow_left_alt_24x24-white.svg";
import setCategoriesMenuVisibility from "../utils/setCategoriesMenuVisibility";

const CategoriesMenuMain = forwardRef(({ setSelectedId, navCategoryBtnRef, firstSecCategoryRef }, mainCategoriesListRef) => {
  const { app, deviceStore } = useContext(Context);
  const categoriesMenuMainRef = useRef(null);
  
  const firstFocusTrapRef = useRef(null);
  const lastFocusTrapRef = useRef(null);

  const mainCategories = deviceStore.categories.filter(category => category.treeParentCategoriesIds === null);

  useFocusTraps(firstFocusTrapRef, lastFocusTrapRef, categoriesMenuMainRef, 2)
  return (
    <section className="categories-menu-main" ref={categoriesMenuMainRef}>
      <div className="visually-hidden p-absolute" tabIndex={0} ref={firstFocusTrapRef} />
      <SkipToNextPageContent 
        title="Return back" 
        iconSrc={returnBackIcon}
        elemToFocus={navCategoryBtnRef.current} 
        isIconInTheEnd={false}
        focusCallback={() => setCategoriesMenuVisibility(false, app)}
      />
      <ul ref={mainCategoriesListRef}>
        {mainCategories.map(category => 
          <li key={category.id}>
            <CategoriesMenuMainItem 
              type="categoriesMenu"
              category={category} 
              setSelectedId={setSelectedId}
              firstSecCategoryRef={firstSecCategoryRef}
            />
          </li>
        )}
      </ul>
      <div className="visually-hidden p-absolute" tabIndex={0} ref={lastFocusTrapRef} />
    </section>
  );
});

export default CategoriesMenuMain;
