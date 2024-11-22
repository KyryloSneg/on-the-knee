import "./Tab.css";
import useCurrentPath from "../../../hooks/useCurrentPath";
import { Link } from "react-router-dom";

const Tab = ({ tabData, doesHaveDynamicParam }) => {
  const currentPath = useCurrentPath();
  
  // delete query params before checking is this tab active
  let tabDataRoute = tabData.to.split("?")[0];
  if (doesHaveDynamicParam) {
    // replace dynamic param value with the param's name 
    let splittedTabDataTo = tabDataRoute.split("/");
    splittedTabDataTo[2] = currentPath.split("/")[2];
    
    tabDataRoute = splittedTabDataTo.join("/");
  }
  
  // routes can include "subroutes"
  const active = currentPath === tabDataRoute || currentPath.startsWith(tabData?.baseRoute);

  let className = "tab";
  if (active) {
    className += " active";
  }

  let icon;
  if (tabData.iconSrc !== undefined && tabData.iconSrc !== null) {
    icon = <img src={tabData.iconSrc} alt="" draggable="false" />;
  } else if (tabData.svgIcon !== undefined && tabData.svgIcon !== null) {
    icon = tabData.svgIcon;
  }

  return (
    <Link to={tabData.to} className={className} onClick={() => window.scroll(0, 0)}>
      {icon
        ? (
          <>
            {icon}
            {tabData.children}
          </>
        )
        : tabData.children
      }
    </Link>
  );
}

export default Tab;
