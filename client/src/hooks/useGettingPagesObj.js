import _ from "lodash";
import { useRef } from "react";

export default function useGettingPagesObj(allItems, page, pagesToFetch, limit) {
  const prevPagesRef = useRef({});

  function getPagesObj() {
    let pagesObj = {};

    if (allItems.length) {
      const lastCurrentPage = page + pagesToFetch - 1;

      let index = 0;
      for (let currentPage = page; currentPage <= lastCurrentPage; currentPage++) {
        const start = limit * index;
        const end = limit * (index + 1);

        const devices = allItems.slice(start, end);

        if (_.isEqual(devices, prevPagesRef.current[currentPage])) {
          pagesObj[currentPage] = prevPagesRef.current[currentPage];
        } else {
          pagesObj[currentPage] = devices;
        }

        index++;
      }
    }

    return pagesObj;
  }

  const pagesObj = getPagesObj();
  prevPagesRef.current = pagesObj;

  return pagesObj;
}