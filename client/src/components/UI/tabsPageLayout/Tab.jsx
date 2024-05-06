import useCurrentPath from "../../../hooks/useCurrentPath";
import "./Tab.css";
import { Link } from "react-router-dom";

const Tab = ({ tabData }) => {
  const currentPath = useCurrentPath();
  // replace dynamic param :deviceIdCombo value with the param's name 
  let splittedTabDataTo = tabData.to.split("/");
  splittedTabDataTo[2] = ":deviceIdCombo";
  
  const tabDataRoute = splittedTabDataTo.join("/");
  const active = currentPath === tabDataRoute;

  let className = "tab";
  if (active) {
    className += " active";
  }

  return (
    <Link to={tabData.to} className={className}>
      {tabData.name}
    </Link>
  );
}

export default Tab;
