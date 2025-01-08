import "./ImagesCarousel.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CustomScrollbar from "../customScrollbar/CustomScrollbar";
import CarouselContent from "./CarouselContent";
import CarouselSidebar from "./CarouselSidebar";
import useWindowWidth from "../../../hooks/useWindowWidth";
import { WIDTH_TO_SHOW_DEVICE_CAROUSEL_SIDEBAR } from "../../../utils/consts";
import CarouselBottomSelectBar from "./CarouselBottomSelectBar";
import { useLocation } from "react-router-dom";
import { v4 } from "uuid";

const POSSIBLE_TYPES = ["default", "device"];
const ImagesCarousel = ({ 
  type = "default", images, className = "", isInModal = false, initialSelectedId = 0, 
  toResetOnLocationChange = false, device = null, textSaleTypes = null, logoSaleTypes = null 
}) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Catalog Page is not defined or incorrect");
  const location = useLocation();
  const windowWidth = useWindowWidth();

  const [selectedId, setSelectedId] = useState(initialSelectedId);

  const carouselContentRefs = useRef(null);
  const sidebarRef = useRef(null);
  const bottomSelectBarRef = useRef(null);
  
  let sectionClassName = "images-carousel";
  if (className) sectionClassName += ` ${className}`;

  const isToRenderSidebar = (type === "device" && windowWidth >= WIDTH_TO_SHOW_DEVICE_CAROUSEL_SIDEBAR && images.length > 1);
  const isToRenderBottomSelectBar = type === "device"
    ? windowWidth < WIDTH_TO_SHOW_DEVICE_CAROUSEL_SIDEBAR && images.length > 1
    : images.length > 1;

  useEffect(() => {
    if (toResetOnLocationChange) setSelectedId(0);
  }, [location, toResetOnLocationChange]);

  const selectPrev = useCallback(() => {
    const nextSelectedId = selectedId - 1;
    setSelectedId(nextSelectedId);

    if (nextSelectedId === 0) {
      // focusing the btn only after a possible user click
      setTimeout(() => {
        carouselContentRefs.current.selectNextImgBtn?.focus();
      }, 0);
    } else {
      setTimeout(() => {
        carouselContentRefs.current.selectPrevImgBtn?.focus();
      }, 0);
    }
  }, [selectedId]);

  const selectNext = useCallback(() => {
    const nextSelectedId = selectedId + 1;
    setSelectedId(nextSelectedId);

    if (nextSelectedId === images.length - 1) {
      // focusing the btn only after a possible user click
      setTimeout(() => {
        carouselContentRefs.current.selectPrevImgBtn?.focus();
      }, 0);
    } else {
      setTimeout(() => {
        carouselContentRefs.current.selectNextImgBtn?.focus();
      }, 0);
    }
  }, [selectedId, images.length]);

  const onKeyDown = useCallback((e) => { 
    // using refs in non-modal version to possibly not invoke scrolling the sidebar with arrows 
    if (
      isInModal
      || carouselContentRefs.current.carouselContent?.contains(e.target)
      || sidebarRef.current?.contains(e.target)
      || bottomSelectBarRef.current?.contains(e.target)
    ) {
      switch (e.key) {
        case "ArrowLeft":
          // preventing horizontal scroll
          e.preventDefault();
          
          if (selectedId > 0) selectPrev();
          break;
        case "ArrowUp":
          // preventing vertical scroll
          e.preventDefault();

          if (isToRenderSidebar) {
            if (selectedId > 0) selectPrev();
          }
          
          break;
        case "ArrowRight":
          // preventing horizontal scroll
          e.preventDefault();
          
          if (selectedId < images.length - 1) selectNext();
          break;
        case "ArrowDown":
          // preventing vertical scroll
          e.preventDefault();

          if (isToRenderSidebar) {
            if (selectedId < images.length - 1) selectNext();
          }

          break;
        default:
          break;
      }
    }
  }, [isInModal, images.length, isToRenderSidebar, selectNext, selectPrev, selectedId]);

  useEffect(() => {
    if (isInModal) {
      document.body.addEventListener("keydown", onKeyDown)
    }

    return () => document.body.removeEventListener("keydown", onKeyDown);
  }, [isInModal, onKeyDown]);
  
  let sectionAdditionalProps = useMemo(() => {
    let result = {};
    if (!isInModal) result.onKeyDown = onKeyDown;
    
    return result;
  }, [isInModal, onKeyDown]);

  const tabAndTabpanelIdsUuid = useMemo(() => v4(), []);
  const tabIdWithoutIndex = "carousel-tab-" + tabAndTabpanelIdsUuid;
  const tabpanelIdWithoutIndex = "carousel-tabpanel-" + tabAndTabpanelIdsUuid;

  return (
    <section className={sectionClassName} {...sectionAdditionalProps}>
      {isToRenderSidebar &&
        <CustomScrollbar
          className="images-carousel-scrollbar"
          children={
            <CarouselSidebar
              images={images}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              tabIdWithoutIndex={tabIdWithoutIndex}
              tabpanelIdWithoutIndex={tabpanelIdWithoutIndex}
              ref={sidebarRef}
            />
          }
        />
      }
      <CarouselContent
        type={type}
        images={images}
        selectedId={selectedId}
        selectPrevImage={selectPrev}
        selectNextImage={selectNext}
        isBottomSelectBarOrSidebarRendered={isToRenderSidebar || isToRenderBottomSelectBar}
        tabIdWithoutIndex={tabIdWithoutIndex}
        tabpanelIdWithoutIndex={tabpanelIdWithoutIndex}
        device={device}
        textSaleTypes={textSaleTypes}
        logoSaleTypes={logoSaleTypes}
        ref={carouselContentRefs}
      />
      {isToRenderBottomSelectBar &&
        <CarouselBottomSelectBar 
          images={images} 
          selectedId={selectedId} 
          setSelectedId={setSelectedId}
          tabIdWithoutIndex={tabIdWithoutIndex}
          tabpanelIdWithoutIndex={tabpanelIdWithoutIndex}
          ref={bottomSelectBarRef}
        />
      }
    </section>
  );
}

export default ImagesCarousel;
