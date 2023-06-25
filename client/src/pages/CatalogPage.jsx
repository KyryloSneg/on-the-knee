import Dropdown from "../components/UI/dropdown/Dropdown";
import TopFilterBar from "../components/TopFilterBar";

const CatalogPage = () => {
  return (
    <div className="display-grid">
      <TopFilterBar />
      <Dropdown variant="sorting-filter" paramKey="sort" />
    </div>
  );
}

export default CatalogPage;
