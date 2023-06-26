import Dropdown from "../components/UI/dropdown/Dropdown";
import TopFilterBar from "../components/TopFilterBar";
import Aside from "../components/Aside";
import "./styles/CatalogPage.css";
import { forwardRef } from "react";
import useWindowWidth from "../hooks/useWindowWidth";

const CatalogPage = forwardRef((props, ref) => {
  const windowWidth = useWindowWidth();

  return (
    <div className="display-grid">
      {/* if window width is bigger than 800px, clicking the "skip to next page content" btn
       in navbar will focus the top filter bar else dropdown */}
      {windowWidth >= 800 
        ? (
          <div className="ref-purpose-only display-grid">
            <Dropdown variant="sorting-filter" paramKey="sort" ref={ref} />
          </div>
        )
        : (
          <div className="ref-purpose-only display-grid">
            <TopFilterBar ref={ref} />
            <Dropdown variant="sorting-filter" paramKey="sort" />
          </div>
        )
      }
      <div id="wrapper">
        <Aside />
      </div>
    </div>
  );
});

export default CatalogPage;
