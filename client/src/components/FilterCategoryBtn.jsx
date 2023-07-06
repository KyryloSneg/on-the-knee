import dropdownArrowIcon from "../assets/expand_more.svg";
import { animate, makeEaseOutLinearQuad, quad } from "../utils/animation";
import useDebounce from "../hooks/useDebounce";
import "./styles/FilterCategoryBtn.css";

const initialPriceClass = "price-range-form-wrap use-preety-scrollbar";
const initialFiltersClass = "filters use-preety-scrollbar";

const FilterCategoryBtn = ({ 
  filter,
  visible,
  setVisible, 
  blockItemRef,
  optionRefs,
  filterCategoryBlockId, 
  setBlockItemClassName,
  variant, 
  elemToFocusRef = null, 
}) => {
  const isWithSearchField = variant === "withSearchField";
  const isPrice = variant === "price";
  const animationDuration = 300;

  function onClick() {
    const nextVisible = !visible;

    function draw(progress) {
      const maxHeight = 195;
      blockItemRef.current.style.maxHeight = (maxHeight * progress) + "px";
    }

    function animationRunHandler() {
      if (nextVisible) {
        blockItemRef.current.style.display = "grid";
      }
    }

    function animationEndHandler() {
      if (nextVisible) {
        if (isWithSearchField || isPrice) {
          // console.log(optionRefs.current);
          if (elemToFocusRef) elemToFocusRef.current.focus();
        } else {
          optionRefs.current[0].focus();
        }

        if (isPrice) {
          setBlockItemClassName(`${initialPriceClass}`) 
        } else {
          setBlockItemClassName(`${initialFiltersClass}`)
        }
      } else {
        blockItemRef.current.style.display = "none";

        if (isPrice) {
          setBlockItemClassName(`${initialPriceClass} collapsed`) 
        } else {
          setBlockItemClassName(`${initialFiltersClass} collapsed`) 
        }
      }

      blockItemRef.current.removeEventListener("jsAnimationRun", animationRunHandler);
      blockItemRef.current.removeEventListener("jsAnimationEnd", animationEndHandler);
    }

    blockItemRef.current.addEventListener("jsAnimationRun", animationRunHandler);
    blockItemRef.current.addEventListener("jsAnimationEnd", animationEndHandler);
    
    const timing = nextVisible ? quad : makeEaseOutLinearQuad(quad);

    animate({
      timing: timing,
      draw: draw,
      duration: animationDuration,
      elem: blockItemRef.current,
    });

    setVisible(nextVisible);
  }

  const debouncedOnClick = useDebounce(onClick, animationDuration + 100);

  return (
    <button onClick={debouncedOnClick} data-testid={`CategoryBlockBtn: ${filterCategoryBlockId}`}>
      <p>{filter[0].toUpperCase() + filter.slice(1)}</p>
      <img src={dropdownArrowIcon} alt="" className={visible ? "rotated" : ""} draggable="false" />
      {/* <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
        <path d="m12 15-5-5h10Z" />
      </svg> */}
    </button>
  );
}

export default FilterCategoryBtn;
