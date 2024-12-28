import "./styles/ChildItemGroupsBar.css";
import ChildItemGroup from "./ChildItemGroup";

const POSSIBLE_TYPES = ["categories", "sales"];

/**
  * a bar with subcategories or sale types
  * 
  * @component
  * @param {"categories" | "sales"} type
  * @param {Object[]} childItemGroups - categories or sale type names
  */
const ChildItemGroupsBar = ({ type, childItemGroups }) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of ChildItemGroupsBar is incorrect");

  return (
    <nav className="child-categories-bar">
      <ul className="child-item-groups-bar">
        {childItemGroups.map(itemGroup =>
          <li key={itemGroup.id}>
            <ChildItemGroup itemGroup={itemGroup} type={type} />
          </li>  
        )}
      </ul>
    </nav>
  );
}

export default ChildItemGroupsBar;
