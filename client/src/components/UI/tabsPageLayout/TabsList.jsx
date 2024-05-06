import "./TabsList.css";
import Tab from "./Tab";

const TabsList = ({ tabsData }) => {
  return (
    <ul className="tabs-list">
      {tabsData.map(tab => 
        <li key={tab.to}>
          <Tab tabData={tab} />
        </li>
      )}
    </ul>
  );
}

export default TabsList;
