import "./TabsPageLayout.css";
import TabsList from "./TabsList";
import CustomScrollbar from "../customScrollbar/CustomScrollbar";

// tabsData: [{ name: "...", to: "..." }, ...]
// pageContent: page component
const TabsPageLayout = ({ tabsData, pageContent }) => {
  return (
    <section className="tabs-page-layout">
      <CustomScrollbar 
        children={<TabsList tabsData={tabsData} />} 
        className="tabs-page-scroll"
      />
      {pageContent}
    </section>
  );
}

export default TabsPageLayout;
