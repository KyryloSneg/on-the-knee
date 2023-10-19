import { Link, useLocation } from "react-router-dom";
import URLActions from "../../../utils/URLActions";

const PagesPagination = ({ totalPages, currentPage }) => {
  useLocation();

  function calculatePages() {
    let pages = [];

    function addShowMorePages(toPrepend = true, toAppend = true) {
      // if adding first "show more" page, add it after page 1
      if (toPrepend) pages.unshift({ name: "...", value: currentPage - 3 });
      if (toAppend) pages.push({ name: "...", value: currentPage + 3 });
    }

    function pushPages(firstNumber, lastNumber) {
      for (let number = firstNumber; number <= lastNumber; number++) {
        pages.push({
          name: `${number}`,
          value: number
        });
      }
    }

    // HINT: "[some name]" is a page button
    if (currentPage - 5 > 0 && currentPage + 5 <= totalPages) {
      // [1] [...] [4] [5] [6 *selected*] [7] [8] [...] [60 *total pages*]

      pushPages(currentPage - 2, currentPage + 2);
      addShowMorePages();
    } else if (currentPage - 5 > 0) {
      // [1] [...] [4] [5] [6 *selected*] [7] [8] [9] [10 *total pages*]

      pushPages(totalPages - 6, totalPages - 1);
      addShowMorePages(true, false);
    } else if (currentPage + 5 <= totalPages) {
      // [1] [2] [3] [4] [5 *selected*] [6] [7] [...] [10 *total pages*]

      pushPages(2, 7);
      addShowMorePages(false, true);
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
    return pages;
  }

  const pages = calculatePages();
  return (
    <ul className="pages-pagination">
      {pages.map(pg => {
        let to = URLActions.setNewParam("page", pg.value);
        let [url, queryParams] = to.split("?");
        // resetting "pagesToFetch" state in url
        queryParams = queryParams.split("&").map((param) => {
          if (!param.startsWith("pagesToFetch=")) return `&${param}`;
          return `&pagesToFetch=1`;
        }).join("");
        to = `${url}?${queryParams}`

        return (
          <li key={`page-pagination: ${pg.name}-${pg.value}`}>
            <Link
              to={to}
              className="page-pagination-btn"
            >
              {pg.name}
            </Link>
          </li>
        );
      }
      )}
    </ul>
  );
}

export default PagesPagination;
