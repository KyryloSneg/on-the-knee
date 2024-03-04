import { useEffect } from "react";
import { OverlayScrollbars } from "overlayscrollbars";

const config = {
  scrollbars: {
    theme: "my-scrollbar"
  }
};

function useScrollbars(root, hasScroll = true) {
  useEffect(() => {
    let scrollbars;

    if (root.current && hasScroll) {
      scrollbars = OverlayScrollbars(root.current, config);
    }

    return () => {
      if (scrollbars) {
        scrollbars.destroy();
      }
    }
  }, [root, hasScroll]);
}

export default useScrollbars;