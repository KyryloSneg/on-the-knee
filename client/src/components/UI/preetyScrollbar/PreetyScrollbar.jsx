import { useEffect, useRef, useState } from "react";
import "./PreetyScrollbar.css";
import CustomScroll from "react-custom-scroll";

const PreetyScrollbar = ({ children, id, isRect = false, heightRelativeToParent = "100%", className = "", ...props }) => {
  const scrollWrapRef = useRef(null);

  const [isInitiallyScrollable, setIsInitiallyScrollable] = useState(false);
  const [wasScrollCalled, setWasScrollCalled] = useState(false);

  const prevChildrenClientHeight = useRef(null);
  const prevChildrenScrollHeight = useRef(null);
  const childrenElemRef = useRef(null);
  const innerContainerRef = useRef(null);

  let scrollClassName = `${className}`;
  if (!isRect) {
    scrollClassName += " circle-version";
  }

  // console.log(id, isInitiallyScrollable, !wasScrollCalled);
  if (isInitiallyScrollable && !wasScrollCalled) {
    scrollClassName += " with-scrollbar-placeholder";
    // using hack because i don't want to use css vars in this project
    const innerContainer = innerContainerRef.current;

    const height = (innerContainer.clientHeight / innerContainer.scrollHeight * 100).toFixed(2);
    const thumbStyleElem = document.head.appendChild(document.createElement("style"));
    thumbStyleElem.innerHTML = 
    `
      #${id} .rcs-custom-scroll.with-scrollbar-placeholder .rcs-outer-container::after {
        height: ${height}%;
      }
    `;
  }

  useEffect(() => {
    const scrollWrapElem = scrollWrapRef.current;
    // the chain ends up with error if the function in the effect if user has scrolled children element 
    // but this is not the case

    // (yes, i really don't want to handle the logic in every children element that much)
    const childrenElem = scrollWrapElem.children[0].children[0].children[0].children[0].children[0];
    childrenElemRef.current = childrenElem;

    const resizeObserver = new ResizeObserver(entries => {
      const elem = entries[0].target;
      const innerContainer = scrollWrapElem.children[0].children[0].children[0];
      innerContainerRef.current = innerContainer;

      const isScrollable = 
        (prevChildrenClientHeight.current !== null && prevChildrenScrollHeight.current !== null) &&
        (prevChildrenClientHeight.current !== elem.clientHeight && prevChildrenScrollHeight.current !== elem.scrollHeight) &&
        (innerContainer.scrollHeight - innerContainer.clientHeight >= 1);

      if (isScrollable && !isInitiallyScrollable) {
        setIsInitiallyScrollable(true);
      }

      prevChildrenClientHeight.current = elem.clientHeight;
      prevChildrenScrollHeight.current = elem.scrollHeight;
    });

    resizeObserver.observe(childrenElem);
    return () => resizeObserver.disconnect();
    // eslint-disable-next-line
  }, []);

  function onScroll() {
    if (!wasScrollCalled) {
      // removing scrollbar placeholder if we had one
      setWasScrollCalled(true);
    }
  }

  return (
    <div ref={scrollWrapRef} className="w-100" id={id}>
      <CustomScroll
        heightRelativeToParent={heightRelativeToParent}
        className={scrollClassName}
        onScroll={onScroll}
        {...props}
      >
        {children}
      </CustomScroll>
    </div>
  );
}

export default PreetyScrollbar;
