import "./styles/Menu.css";
import MenuAccountBtn from "./MenuAccountBtn";
import MenuCatalogBtn from "./MenuCatalogBtn";

const Menu = () => {
  return (
    <nav id="menu">
      <ul className="menu-items">
        {
          /* 
            1. user
            2. main page
            3. catalog (categories modal window)
            4. desired list
            5. city selection
          */
        }
        <li>
          <MenuAccountBtn />
        </li>
        <li>
          <MenuCatalogBtn />
        </li>
      </ul>
    </nav>
  );
}

export default Menu;
