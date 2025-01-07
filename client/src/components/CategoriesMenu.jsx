import "./styles/CategoriesMenu.css";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Context } from "../Context";
import setCategoriesMenuVisibility from "../utils/setCategoriesMenuVisibility";
import useClickOnEverything from "../hooks/useClickOnEverything";
import CategoriesMenuMain from "./CategoriesMenuMain";
import CategoriesMenuSecondary from "./CategoriesMenuSecondary";
import useWindowInvisibleFocus from "../hooks/useWindowInvisibleFocus";
import getAllFocusableElements from "../utils/getAllFocusableElements";
import { observer } from "mobx-react-lite";

const CategoriesMenu = observer(({ navCategoryBtnRef }) => {
  const { app, deviceStore } = useContext(Context);

  const categoriesMenuRef = useRef(null);
  const categoriesMenuSecRef = useRef(null);
  const mainCategoriesListRef = useRef(null);

  const firstSecCategoryRef = useRef(null);
  const firstCategoryRef = useRef(null);

  const getFirstCategoryId = useCallback(() => {
    const result = deviceStore.categories?.find(category => category.treeParentCategoriesIds === null)?.id || null;
    return result;
  }, [deviceStore.categories]);

  const [selectedId, setSelectedId] = useState(getFirstCategoryId());

  useEffect(() => {
    setSelectedId(getFirstCategoryId())
  }, [deviceStore.categories, getFirstCategoryId]);

  const isHidden = !app.isVisibleCategoriesMenu || !Object.keys(deviceStore.categories).length;

  const closeMenu = useCallback(() => {
    setCategoriesMenuVisibility(false, app);
  }, [app]);

  useEffect(() => {
    firstSecCategoryRef.current = getAllFocusableElements(categoriesMenuSecRef.current)?.[0] || { current: null };
  }, [isHidden, selectedId]);

  useEffect(() => {
    firstCategoryRef.current = getAllFocusableElements(categoriesMenuRef.current)?.[2] || { current: null };
  }, [isHidden]);

  useWindowInvisibleFocus(firstCategoryRef, app.isVisibleCategoriesMenu);
  useClickOnEverything(isHidden ? null : closeMenu, categoriesMenuRef);

  function onBlurCapture(e) {
    // e.relatedTarget sometimes can be null
    if (!e.relatedTarget) return;
    if (e.relatedTarget.classList.contains("nav-category-button")) return;
    const allFocusableMenuElements = getAllFocusableElements(categoriesMenuRef.current);

    if (!allFocusableMenuElements) return;
    if (!allFocusableMenuElements.includes(e.relatedTarget)) {
      closeMenu();

      // idk why but if user clicks on any interactive element activeElement is equals to body
      // (so we can state that user left categories menu by mouse click and we must not focus the button)
      if (document.activeElement !== document.body) navCategoryBtnRef.current.focus();
    }
  }

  let className = "window";
  if (isHidden) {
    className += " display-none";
  }

  return (
    <section id="categories-menu" className={className} ref={categoriesMenuRef} onBlurCapture={onBlurCapture}>
      {!isHidden && (
        <>
          <CategoriesMenuMain 
            setSelectedId={setSelectedId} 
            navCategoryBtnRef={navCategoryBtnRef} 
            firstSecCategoryRef={firstSecCategoryRef}  
            ref={mainCategoriesListRef}
          />
          <CategoriesMenuSecondary 
            selectedId={selectedId} 
            mainCategoriesListRef={mainCategoriesListRef}
            ref={categoriesMenuSecRef} 
          />
        </>
      )}
    </section>
  );
});

export default CategoriesMenu;
