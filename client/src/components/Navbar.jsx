import SearchProductsForm from "./UI/searchProductsForm/SearchProductsForm";
import "./styles/Navbar.css";
import StoreTitle from "./UI/storeTitle/StoreTitle";
import NavMenuBtn from "./NavMenuBtn";
import NavCategoryBtn from "./NavCategoryBtn";
import NavAccountBtn from "./NavAccountBtn";
import NavCartBtn from "./NavCartBtn";
import SkipToNextPageContent from "./UI/skipToNextPageContent/SkipToNextPageContent";
import NavDesiredListBtn from "./NavDesiredListBtn";
import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";

const Navbar = ({ elemToFocus, navCategoryBtnRef }) => {
  const { app } = useContext(Context);
  
  const btnGroupRef = useRef(null);
  const navbarRef = useRef(null);

  useEffect(() => {
    app.setNavBtnGroupRef(btnGroupRef)
  }, [app, btnGroupRef]);

  return (
    <nav ref={navbarRef}>
      <SkipToNextPageContent title="Skip to the main page" elemToFocus={elemToFocus} />
      <StoreTitle title={"On the knee"} />
      <div ref={btnGroupRef} data-testid="navbar-btn-group">
        <NavMenuBtn />
        <NavCategoryBtn ref={navCategoryBtnRef} />
        <SearchProductsForm navbarRef={navbarRef} />
        <NavAccountBtn />
        <NavDesiredListBtn />
        <NavCartBtn />
      </div>
    </nav>
  );
}

export default Navbar;
