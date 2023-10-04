import Dropdown from "../components/UI/dropdown/Dropdown";
import TopFilterBar from "../components/TopFilterBar";
import Aside from "../components/Aside";
import "./styles/CatalogPage.css";
import useWindowWidth from "../hooks/useWindowWidth";
import DeviceSection from "../components/DeviceSection";
import { useOutletContext } from "react-router-dom";
import { sortingOptions } from "../utils/consts";

const CatalogPage = () => {
  const { pageRef } = useOutletContext();
  const windowWidth = useWindowWidth();

  return (
    <div className="display-grid">
      {/* if window width is bigger than 800px, clicking the "skip to next page content" btn
       in navbar will focus the top filter bar else dropdown */}
      {windowWidth >= 800 
        ? (
          <div className="ref-purpose-only display-grid">
            <Dropdown 
              variant="sorting-filter" 
              options={sortingOptions} 
              paramKey="sort" 
              ref={pageRef} 
            />
          </div>
        )
        : (
          <div className="ref-purpose-only display-grid">
            <TopFilterBar ref={pageRef} />
            <Dropdown 
              variant="sorting-filter"
              options={sortingOptions}  
              paramKey="sort"
            />
          </div>
        )
      }
      <div id="wrapper">
        <Aside />
        {/* TODO: setting deviceSectionRef in useEffect of DeviceSection */}
        <DeviceSection />
      </div>
    </div>
  );
};

export default CatalogPage;
