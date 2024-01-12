import CategoryMenuSecColBlock from "./CategoriesMenuSecColBlock";
import "./styles/CategoriesMenuSecColumn.css"

const CategoriesMenuSecColumn = ({ columnCategories, selectedId }) => {
  return (
    <ul className="category-menu-sec-column">
      {columnCategories.map(secondaryCategoriesObj =>
        <li key={secondaryCategoriesObj.topCategory.id}>
          <CategoryMenuSecColBlock 
            secondaryCategoriesObj={secondaryCategoriesObj} 
            selectedId={selectedId}
          />
        </li>
      )}
    </ul>
  );
}

export default CategoriesMenuSecColumn;
