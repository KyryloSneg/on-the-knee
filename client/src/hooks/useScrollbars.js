import { useEffect } from "react";
import { OverlayScrollbars, ScrollbarsHidingPlugin, SizeObserverPlugin } from "overlayscrollbars";

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

      // plugins to make it work in old browsers
      scrollbars.plugin(ScrollbarsHidingPlugin);
      scrollbars.plugin(SizeObserverPlugin);
    }

    return () => {
      if (scrollbars) {
        scrollbars.destroy();
      }
    }
  }, [root, hasScroll]);
}

export default useScrollbars;