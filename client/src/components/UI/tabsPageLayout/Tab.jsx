import "./Tab.css";
import useCurrentPath from "../../../hooks/useCurrentPath";
import { Link } from "react-router-dom";

const Tab = ({ tabData, doesHaveDynamicParam }) => {
  const currentPath = useCurrentPath();
  
  let tabDataRoute = tabData.to;
  if (doesHaveDynamicParam) {
    // replace dynamic param value with the param's name 
    let splittedTabDataTo = tabData.to.split("/");
    splittedTabDataTo[2] = currentPath.split("/")[2];
    
    tabDataRoute = splittedTabDataTo.join("/");
  }
  
  const active = currentPath === tabDataRoute;

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
    <Link to={tabData.to} className={className}>
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
