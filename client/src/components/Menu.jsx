import "./styles/Menu.css";
import MenuAccountBtn from "./MenuAccountBtn";
import MenuCatalogBtn from "./MenuCatalogBtn";
import MenuOrdersBtn from "./MenuOrdersBtn";
import MenuDesiredListBtn from "./MenuDesiredListBtn";
import MenuViewedDevicesBtn from "./MenuViewedDevicesBtn";
import MenuFeedbacksBtn from "./MenuFeedbacksBtn";
import UserLocationBtn from "./UserLocationBtn";

const Menu = () => {
  return (
    <nav id="menu">
      <ul className="menu-items">
        <li>
          <MenuAccountBtn />
        </li>
        <li>
          <MenuCatalogBtn />
        </li>
        <li>
          <MenuOrdersBtn />
        </li>
        <li>
          <MenuDesiredListBtn />
        </li>
        <li>
          <MenuViewedDevicesBtn />
        </li>
        <li>
          <MenuFeedbacksBtn />
        </li>
        <li>
          <UserLocationBtn className="menu-location-btn" />
        </li>
      </ul>
    </nav>
  );
}

export default Menu;
