import "./TabsPageLayout.css";
import TabsList from "./TabsList";
import CustomScrollbar from "../customScrollbar/CustomScrollbar";

// tabsData: [{ children: "...", to: "...", iconSrc: undefined, svgIcon: undefined }, ...]
// pageContent: page component
const TabsPageLayout = ({ 
  tabsData, pageContent, doesHaveDynamicParam, 
  isToUsePaddingForPage = true, isVerticalLayout = true 
}) => {
  let className = "tabs-page-layout";
  if (!isToUsePaddingForPage) {
    className += " no-page-padding";
  }

  if (isVerticalLayout) {
    className += " vertical-layout";
  } else {
    className += " horizontal-layout";
  }

  return (
    <section className={className}>
      <CustomScrollbar 
        children={<TabsList tabsData={tabsData} doesHaveDynamicParam={doesHaveDynamicParam} />} 
        className="tabs-page-scroll"
      />
      {pageContent}
    </section>
  );
}

export default TabsPageLayout;
