import { forwardRef, useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import "./styles/CategoriesMenuSecondary.css";
import CategoriesMenuSecColumn from "./CategoriesMenuSecColumn";
import SkipToNextPageContent from "./UI/skipToNextPageContent/SkipToNextPageContent";
import useFocusTraps from "../hooks/useFocusTraps";
import getAllFocusableElements from "../utils/getAllFocusableElements";
import returnBackIcon from "../assets/arrow_left_alt_24x24-white.svg";
import CategoriesMenuSecBottom from "./CategoriesMenuSecBottom";
import { CATEGORIES_COL_LVL_THREE_LIMIT } from "../utils/consts";

const CATEGORIES_COL_HEIGHT = 400;
const COLUMNS_NUMBER = 3;
// 2 pixels to spare
const VERTICAL_COL_PADDING = 16;

const CATEGORY_NEST_LEVEL_2_HEIGHT = 23;
const CATEGORY_NEST_LEVEL_3_HEIGHT = 17;

const CATEGORY_NEST_LEVEL_2_GAP = 10;
const CATEGORY_NEST_LEVEL_3_GAP = 4;

const CategoriesMenuSecondary = forwardRef(({ selectedId, mainCategoriesListRef }, categoriesSecColsRef) => {
  const { deviceStore } = useContext(Context); 
  const categoriesMenuSecRef = useRef(null);
  const selectedMainCategoryRef = useRef(null);

  const firstFocusTrapRef = useRef(null);
  const lastFocusTrapRef = useRef(null);
  useFocusTraps(firstFocusTrapRef, lastFocusTrapRef, categoriesMenuSecRef, 2)

  useEffect(() => {
    const mainCategoriesItems = getAllFocusableElements(mainCategoriesListRef.current);
    selectedMainCategoryRef.current = mainCategoriesItems?.find(elem => {
      if (elem.tagName !== "A") return false;
      return elem.dataset.id === selectedId;
    });
  }, [mainCategoriesListRef, selectedId]);

  const topSecondaryCategories = deviceStore.categories.filter(category => category.treeParentCategoriesIds?.includes(selectedId));
  let allSecondaryCategories = [];

  for (let topCategory of topSecondaryCategories) {
    const nestedCategories = deviceStore.categories.filter(category => category.treeParentCategoriesIds?.includes(topCategory.id));
    allSecondaryCategories.push({
      topCategory: topCategory,
      nestedCategories: nestedCategories,
    });
  }

  let columnsCategoriesArray = [];
  let leftSecondaryCategories = [...allSecondaryCategories];

  for (let colIndex = 0; colIndex < COLUMNS_NUMBER; colIndex++) {
    if (!leftSecondaryCategories.length) break;
    let leftColumnSpace = CATEGORIES_COL_HEIGHT - VERTICAL_COL_PADDING;

    for (let colCategory of allSecondaryCategories) {
      const isAlreadyExists = !leftSecondaryCategories.find(parentCategory => parentCategory.topCategory.id === colCategory.topCategory.id);
      if (isAlreadyExists) continue;

      const nestedCategoriesAmount = colCategory.nestedCategories?.length || 0;
      // if the value below is less than 0, we don't render it in the current column to prevent content overflowing
      let categoryColBlockHeight = CATEGORY_NEST_LEVEL_2_HEIGHT + 
        (CATEGORY_NEST_LEVEL_3_HEIGHT * nestedCategoriesAmount) + CATEGORY_NEST_LEVEL_2_GAP;
      // the gap doesn't exist if there's only one category (nest level 3)
      categoryColBlockHeight += (CATEGORY_NEST_LEVEL_3_GAP * (nestedCategoriesAmount - 1));

      // category (nest level 2)
      //   category (nest level 3)
      //   nest level 3 gap
      //   category (nest level 3)
      // nest level 2 gap (may be missing)

      let newColumnSpace = leftColumnSpace - categoryColBlockHeight;
      // if (newColumnSpace < 0) newColumnSpace += CATEGORY_NEST_LEVEL_2_GAP;

      // if there's too much nest level 3 categories that causes 3rd column overflow,
      // split them up in half (with floor rounding)
      if (newColumnSpace < 0 && (colCategory.nestedCategories.length > CATEGORIES_COL_LVL_THREE_LIMIT && colIndex === 2)) {
        const oldNestedCategoriesLength = colCategory.nestedCategories.length;

        const sliceEnd = Math.floor(colCategory.nestedCategories.length / 2);
        colCategory.nestedCategories = colCategory.nestedCategories.slice(0, sliceEnd);

        const deletedNestedCategoriesAmount = oldNestedCategoriesLength - colCategory.nestedCategories.length;
        newColumnSpace += (CATEGORY_NEST_LEVEL_3_GAP * (deletedNestedCategoriesAmount - 1)) +
          (CATEGORY_NEST_LEVEL_3_HEIGHT * deletedNestedCategoriesAmount);
      };

      // if there's some nest level 3 categories that causes 3rd column overflow,
      // render only the nest level 2 category (if there's some space left)
      if (newColumnSpace < 0 && colIndex === 2) {
        newColumnSpace += (CATEGORY_NEST_LEVEL_3_GAP * (colCategory.nestedCategories.length - 1)) +
          (CATEGORY_NEST_LEVEL_3_HEIGHT * colCategory.nestedCategories.length);
        colCategory.nestedCategories = [];
      };

      if (newColumnSpace >= 0) {

        if (columnsCategoriesArray[colIndex]) {
          columnsCategoriesArray[colIndex].push(colCategory);  
        } else {
          columnsCategoriesArray[colIndex] = [colCategory]; 
        }

        leftSecondaryCategories = leftSecondaryCategories.filter(parentCategory => parentCategory.topCategory.id !== colCategory.topCategory.id);
        leftColumnSpace = newColumnSpace;

      }
    }

  }

  return (
    <section className="categories-menu-secondary link-colors-wrap" ref={categoriesMenuSecRef}>
      <div className="visually-hidden p-absolute" tabIndex={0} ref={firstFocusTrapRef} />
      <SkipToNextPageContent 
        title="Return back" 
        iconSrc={returnBackIcon}
        elemToFocus={selectedMainCategoryRef} 
        isIconInTheEnd={false}
      />
      <ul className="categories-menu-sec-cols" ref={categoriesSecColsRef}>
        {columnsCategoriesArray.map((colCategories, index) => 
          <li key={index}>
            <CategoriesMenuSecColumn 
              columnCategories={colCategories} 
              selectedId={selectedId}
            />
          </li>
        )}
      </ul>
      <CategoriesMenuSecBottom selectedId={selectedId} />
      <div className="visually-hidden p-absolute" tabIndex={0} ref={lastFocusTrapRef} />
    </section>
  );
});

export default CategoriesMenuSecondary;
