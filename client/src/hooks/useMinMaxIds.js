import { useEffect, useRef } from "react";
import determineSearchResultsCase from "../utils/determineSearchResultsCase";

export default function useMinMaxIds(results, setSelectedId) {
  let minId = useRef(null);
  let maxId = useRef(null);
  
  useEffect(() => {

    const theCase = determineSearchResultsCase(results);
    if (theCase === "+ + +" || theCase === "+ - +") {
      minId.current = results.default[0].id - 1;
      maxId.current = results.categories[results.categories.length - 1].id;

    } else if (theCase === "- + +") {
      minId.current = results.history[0].id - 1;
      maxId.current = results.categories[results.categories.length - 1].id;

    } else if (theCase === "+ + -") {
      minId.current = results.default[0].id - 1;
      maxId.current = results.history[results.history.length - 1].id;

    } else if (theCase === "+ - -") {
      minId.current = results.default[0].id - 1;
      maxId.current = results.default[results.default.length - 1].id;

    } else if (theCase === "- + -") {
      minId.current = results.history[0].id - 1;
      maxId.current = results.history[results.history.length - 1].id;

    } else if (theCase === "- - +") {
      minId.current = results.categories[0].id - 1;
      maxId.current = results.categories[results.categories.length - 1].id;
      
    } else  {
      minId.current = null;
      maxId.current = null;
    }

    setSelectedId(minId.current);

  }, [results, setSelectedId]);

  return [minId.current, maxId.current];
}