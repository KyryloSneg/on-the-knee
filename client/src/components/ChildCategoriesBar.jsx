import ChildCategory from "./ChildCategory";
import "./styles/ChildCategoriesBar.css";

const ChildCategoriesBar = ({ childCategories }) => {
  return (
    <section className="child-categories-bar">
      <ul className="child-categories-list">
        {childCategories.map(category =>
          <li key={category.id}>
            <ChildCategory category={category} />
          </li>  
        )}
      </ul>
    </section>
  );
}

export default ChildCategoriesBar;
