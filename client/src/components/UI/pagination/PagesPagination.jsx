import "./PagesPagination.css";
import { Link, useLocation } from "react-router-dom";
import URLActions from "../../../utils/URLActions";

// idk how to name it properly
const MIN_DISTANCE_FROM_CURRENT_PAGE_TO_BOUNDARY = 5;
const DISTANCE_FROM_CURRENT_PAGE_TO_BOUNDARY_SHIFT = -1;
const MIN_ITEMS_AMOUNT_TO_HIDE = 2;

const PagesPagination = ({
  totalPages, currentPage, pagesToFetch, className = "", ariaLabel = "Pages"
}) => {
  // re-rendering component on location changes
  useLocation();

  function calculatePages() {
    let pages = [];

    function pushPages(firstNumber, lastNumber) {
      for (let number = firstNumber; number <= lastNumber; number++) {
        pages.push({
          name: `${number}`,
          value: number
        });
      }
    }

    // adding "show more" pages and normal ones except of the first and last pages
    // do not check the code below pls it's a big mistake

    // HINT: "[some name]" is a page button
    if (totalPages > 1) {
      // conditions to render the "..." (more) pages buttons
      const canRenderMore = totalPages > (
        // "+ 1" means: do not include the first (the last) page (don't ask)
        MIN_DISTANCE_FROM_CURRENT_PAGE_TO_BOUNDARY - DISTANCE_FROM_CURRENT_PAGE_TO_BOUNDARY_SHIFT + MIN_ITEMS_AMOUNT_TO_HIDE + 1
      );

      if (canRenderMore) {
        const canRenderLeftMore = currentPage - MIN_DISTANCE_FROM_CURRENT_PAGE_TO_BOUNDARY > 0;
        const canRenderRightMore = (
          currentPage + MIN_DISTANCE_FROM_CURRENT_PAGE_TO_BOUNDARY + DISTANCE_FROM_CURRENT_PAGE_TO_BOUNDARY_SHIFT < totalPages
        );

        if (canRenderLeftMore && canRenderRightMore) {
          // [1] [...] [4] [5] [6 *selected*] [7] [8] [...] [60 *total pages*]
  
          pushPages(currentPage - 2, currentPage + 2);
          pages.unshift({ name: "...", value: currentPage - 3 });
          pages.push({ name: "...", value: currentPage + 3 });
        } else if (canRenderLeftMore) {
          // [1] [...] [4] [5] [6 *selected*] [7] [8] [9] [10 *total pages*]
  
          pushPages(totalPages - 6, totalPages - 1);
          pages.unshift({ name: "...", value: totalPages - 7 });
        } else if (canRenderRightMore) {
          // [1] [2] [3] [4] [5 *selected*] [6] [7] [...] [10 *total pages*]
  
          pushPages(2, 7);
          pages.push({ name: "...", value: 8 });
        }
      } else if (totalPages > 2) {
        // [1] [2 *selected*] [3]
        pushPages(2, totalPages - 1);
      }

      pages.unshift({
        name: "1",
        value: 1
      });

      pages.push({
        name: `${totalPages}`,
        value: totalPages
      });
    } else {
      pages.push({
        name: "1",
        value: 1
      });
    }
    return pages;
  }

  const pages = calculatePages();
  return (
    <ul
      className={`pages-pagination ${className}`}
      aria-label={ariaLabel}
    >
      {pages.map(pg => {
        let to = "#";
        if (pg.value !== currentPage) {
          to = URLActions.setNewParam("page", pg.value);

          let [url, queryParams] = to.split("?");
          // resetting "pagesToFetch" state in url
          queryParams = queryParams.split("&").map((param, index) => {
            if (!param.startsWith("pagesToFetch=")) {

              if (index === 0) {
                return param;
              } else {
                return `&${param}`
              }

            };
            return `&pagesToFetch=1`;
          }).join("");

          to = `${url}?${queryParams}`
        }

        // if our value is in range of [currentPage, currentPage + pagesToFetch)
        // (it is our current page and other pages fetched with "pagesToFetch" query param)
        const isActive = pg.value >= currentPage && pg.value < currentPage + pagesToFetch;
        // last fetched page
        const isSelected = pg.value === currentPage + (pagesToFetch - 1)
        return (
          <li
            key={`page-pagination: ${pg.name}-${pg.value}`}
          >
            {/* in the row that includes aria-label we are conditionally adding it */}
            {pg.value === currentPage
              ? (
                <div
                  className={isActive ? "page-pagination-link active" : "page-pagination-link"}
                  aria-selected={isSelected}
                  {...(pg.name === "..." && { "aria-label": pg.value })}
                >
                  {pg.name}
                </div>
              )
              : (
                <Link
                  to={to}
                  className={isActive ? "page-pagination-link active" : "page-pagination-link"}
                  aria-selected={isSelected}
                  {...(pg.name === "..." && { "aria-label": pg.value })}
                >
                  {pg.name}
                </Link>
              )
            }
          </li>
        );
      })}
    </ul>
  );
}

export default PagesPagination;
