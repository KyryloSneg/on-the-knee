import "./TabsList.css";
import Tab from "./Tab";

const TabsList = ({ tabsData, doesHaveDynamicParam }) => {
  return (
    <ul className="tabs-list">
      {tabsData.map(tab => 
        <li key={tab.to}>
          <Tab tabData={tab} doesHaveDynamicParam={doesHaveDynamicParam} />
        </li>
      )}
    </ul>
  );
}

export default TabsList;
