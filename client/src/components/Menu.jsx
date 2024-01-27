import MenuCatalogBtn from "./MenuCatalogBtn";
import "./styles/Menu.css";

const Menu = () => {
  return (
    <section id="menu">
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
          <MenuCatalogBtn />
        </li>
      </ul>
    </section>
  );
}

export default Menu;
