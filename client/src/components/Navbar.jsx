import SearchProductsForm from "./UI/searchProductsForm/SearchProductsForm";
import "./styles/Navbar.css";
import StoreTitle from "./UI/storeTitle/StoreTitle";
import NavMenuBtn from "./NavMenuBtn";
import NavCategoryBtn from "./NavCategoryBtn";
import NavAccountBtn from "./NavAccountBtn";
import NavCartBtn from "./NavCartBtn";
import SkipTonextPageContent from "./UI/skipToNextPageContent/SkipTonextPageContent";

const Navbar = ({ toFocusRef }) => {
  return (
    <nav>
      <SkipTonextPageContent title="Skip to the products section" toFocusRef={toFocusRef} /> {/* to pass main page ref to focus it */}
      <StoreTitle title={"On the knee"} />
      <div>
        <NavMenuBtn />
        <NavCategoryBtn />
        <SearchProductsForm />
        <NavAccountBtn />
        <NavCartBtn />
      </div>
    </nav>
  );
}

export default Navbar;
