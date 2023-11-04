import SearchProductsForm from "./UI/searchProductsForm/SearchProductsForm";
import "./styles/Navbar.css";
import StoreTitle from "./UI/storeTitle/StoreTitle";
import NavMenuBtn from "./NavMenuBtn";
import NavCategoryBtn from "./NavCategoryBtn";
import NavAccountBtn from "./NavAccountBtn";
import NavCartBtn from "./NavCartBtn";
import SkipToNextPageContent from "./UI/skipToNextPageContent/SkipToNextPageContent";
import NavDesiredListBtn from "./NavDesiredListBtn";
import { useRef } from "react";

const Navbar = ({ elemToFocus }) => {
  const btnGroupRef = useRef(null);
  const navbarRef = useRef(null);

  return (
    <nav ref={navbarRef}>
      <SkipToNextPageContent title="Skip to the main page" elemToFocus={elemToFocus} />
      <StoreTitle title={"On the knee"} />
      <div ref={btnGroupRef} data-testid="navbar-btn-group">
        <NavMenuBtn />
        <NavCategoryBtn />
        <SearchProductsForm btnGroupRef={btnGroupRef} navbarRef={navbarRef} />
        <NavAccountBtn />
        <NavDesiredListBtn />
        <NavCartBtn />
      </div>
    </nav>
  );
}

export default Navbar;
