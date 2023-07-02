import dropdownArrowIcon from "../assets/expand_more.svg";
import { animate, makeEaseOutLinearQuad, quad } from "../utils/animation";
import useDebounce from "../hooks/useDebounce";
import "./styles/FilterCategoryBtn.css";

const FilterCategoryBtn = ({ filter, visible, setVisible, ulRef, optionRefs, selectedByKeyboardId, filterCategoryBlockId, setUlClassName }) => {
  const animationDuration = 300;

  function onClick() {
    const nextVisible = !visible;

    function draw(progress) {
      const maxHeight = 195;
      ulRef.current.style.maxHeight = (maxHeight * progress) + "px";
    }

    function animationRunHandler() {
      if (nextVisible) {
        ulRef.current.style.display = "grid";
      }
    }

    function animationEndHandler() {
      if (nextVisible) {
        optionRefs.current[selectedByKeyboardId].focus();
        setUlClassName("filters")
      } else {
        ulRef.current.style.display = "none";
        setUlClassName("filters collapsed")
      }

      ulRef.current.removeEventListener("jsAnimationRun", animationRunHandler);
      ulRef.current.removeEventListener("jsAnimationEnd", animationEndHandler);
    }

    ulRef.current.addEventListener("jsAnimationRun", animationRunHandler);
    ulRef.current.addEventListener("jsAnimationEnd", animationEndHandler);
    
    const timing = nextVisible ? quad : makeEaseOutLinearQuad(quad);

    animate({
      timing: timing,
      draw: draw,
      duration: animationDuration,
      elem: ulRef.current,
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
