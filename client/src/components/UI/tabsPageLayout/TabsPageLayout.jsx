import "./TabsPageLayout.css";
import TabsList from "./TabsList";
import CustomScrollbar from "../customScrollbar/CustomScrollbar";

// tabsData: [{ name: "...", to: "..." }, ...]
// pageContent: page component
const TabsPageLayout = ({ tabsData, pageContent, isToUsePaddingForPage = true }) => {
  let className = "tabs-page-layout";
  if (!isToUsePaddingForPage) {
    className += " no-page-padding";
  }

  return (
    <section className={className}>
      <CustomScrollbar 
        children={<TabsList tabsData={tabsData} />} 
        className="tabs-page-scroll"
      />
      {pageContent}
    </section>
  );
}

export default TabsPageLayout;
