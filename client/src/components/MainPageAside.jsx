import "./styles/MainPageAside.css";
import { useContext } from "react";
import { Context } from "Context";
import { observer } from "mobx-react-lite";
import CategoriesMenuMainItem from "./CategoriesMenuMainItem";
import MenuAccountBtn from "./MenuAccountBtn";
import UserLocationBtnNotification from "./UserLocationBtnNotification";
import checkIsToRenderViewedDevicesList from "utils/checkIsToRenderViewedDevicesList";

const MainPageAside = observer(() => {
  const { deviceStore, user } = useContext(Context);
  const mainCategories = deviceStore.categories?.filter(category => category.treeParentCategoriesIds === null);

  const isToRenderCategories = !!mainCategories?.length;
  let className = "main-page-aside";
  if (checkIsToRenderViewedDevicesList(user.viewedDevices)) {
    className += " main-page-viewed-devices-rendered";
  }

  return (
    <aside className={className}>
      <nav>
        {isToRenderCategories && (
          <ul>
            {mainCategories.map(category => 
              <li key={category.id}>
                <CategoriesMenuMainItem 
                  type="mainPage"
                  category={category} 
                />
              </li>
            )}
          </ul>
        )}
        {/* just use these buttons from the menu sidebar */}
        <MenuAccountBtn />
        <UserLocationBtnNotification userLocationBtnClassName="menu-location-btn" />
      </nav>
    </aside>
  );
});

export default MainPageAside;
