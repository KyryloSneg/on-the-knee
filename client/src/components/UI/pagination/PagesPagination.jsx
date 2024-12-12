import "./PagesPagination.css";
import { Link, useLocation } from "react-router-dom";
import URLActions from "../../../utils/URLActions";

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
      if (currentPage - 5 > 0 && currentPage + 5 <= totalPages) {
        // [1] [...] [4] [5] [6 *selected*] [7] [8] [...] [60 *total pages*]

        pushPages(currentPage - 2, currentPage + 2);
        pages.unshift({ name: "...", value: currentPage - 3 });
        pages.push({ name: "...", value: currentPage + 3 });
      } else if (currentPage - 5 > 0) {
        // [1] [...] [4] [5] [6 *selected*] [7] [8] [9] [10 *total pages*]

        pushPages(totalPages - 6, totalPages - 1);
        pages.unshift({ name: "...", value: totalPages - 7 });
      } else if (currentPage + 5 <= totalPages) {
        // [1] [2] [3] [4] [5 *selected*] [6] [7] [...] [10 *total pages*]

        pushPages(2, 7);
        pages.push({ name: "...", value: 8 });
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
