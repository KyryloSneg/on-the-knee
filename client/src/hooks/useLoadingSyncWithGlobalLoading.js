import { useEffect } from "react";

// pass isGlobalLoadingSetter instead of creating a new one here
// because we can use the setter in a fetching fn
// and they must be the same
export default function useLoadingSyncWithGlobalLoading(
  isLoading, isGlobalLoadingSetter, additionalCondition = true
) {
  useEffect(() => {
    if (additionalCondition) isGlobalLoadingSetter(isLoading);
  }, [isLoading, isGlobalLoadingSetter, additionalCondition]);

  // reset global loading (without this effect it can be infinite)
  useEffect(() => {
    return () => { if (additionalCondition) isGlobalLoadingSetter(false); };
  }, [isGlobalLoadingSetter, additionalCondition]);
}