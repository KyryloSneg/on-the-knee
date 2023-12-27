const { useEffect } = require("react");
const { animate, easeOut } = require("../utils/animation");

function useSidebarOpening(sidebarRef, animationsDuration, isEndedOpeningAnimRef) {
  useEffect(() => {
    const sidebar = sidebarRef.current;
    function draw(progress) {
      // -100% => 0%
      if (!sidebar) return;
      sidebar.style.left = (progress * 100 - 100) + "%";
    }

    animate({
      timing: easeOut,
      draw: draw,
      duration: animationsDuration,
      elem: sidebar,
      uniqueEventId: "opening",
    });

    function onAnimationRun() {
      isEndedOpeningAnimRef.current = false;
    }

    function onAnimationEnd() {
      isEndedOpeningAnimRef.current = true;
    }

    sidebar.addEventListener("jsAnimationRun-opening", onAnimationRun);
    sidebar.addEventListener("jsAnimationEnd-opening", onAnimationEnd);

    return () => {
      sidebar.removeEventListener("jsAnimationRun-opening", onAnimationRun);
      sidebar.removeEventListener("jsAnimationEnd-opening", onAnimationEnd);
    }
  }, [sidebarRef, animationsDuration, isEndedOpeningAnimRef]);
}

export default useSidebarOpening;