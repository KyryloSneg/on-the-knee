import UsedFilters from "./UsedFilters";
import { observer } from "mobx-react-lite";
import "./styles/Aside.css";
import FilterCategories from "./FilterCategories";
import { useContext, useEffect } from "react";
import { Context } from "../Context";
import { useLocation, useNavigate } from "react-router-dom";
import URLActions from "../utils/URLActions";

const Aside = observer(() => {
  const { deviceStore, isTest } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { usedFilters, url } = URLActions.getUsedFilters(deviceStore.filters);
    deviceStore.setUsedFilters(usedFilters);

    // if the url changed (for example if there's some not existing key or value)
    // we change it to normal one without redundant query params

    // memory router from the tests seems to not work with navigate() function,
    // so it's better to skip the block below
    if (location.pathname !== url && !isTest) {
      const basename = process.env.REACT_APP_CLIENT_URL;
      navigate(url.replace(basename, ""), { replace: true });
    }
  }, [location.search, deviceStore, navigate, location.pathname, isTest]);

  return (
    <aside>
      {Object.keys(deviceStore.usedFilters).length > 0 && <UsedFilters />}
      <FilterCategories />
    </aside>
  );
});

export default Aside;
