import { Link } from "react-router-dom";
import "./styles/DeviceInfoSectionListItem.css";
import StringActions from "../utils/StringActions";
import useWindowWidth from "../hooks/useWindowWidth";
import { WIDTH_TO_SHOW_DEVICE_INFO_DL_SEPARATOR } from "../utils/consts";

const DeviceInfoSectionListItem = ({ info, type = "span", to = null, ...props }) => {
  const windowWidth = useWindowWidth();

  let infoName = StringActions.splitByUpperCaseLetters(info.name);
  infoName = StringActions.capitalize(infoName);

  return (
    <div className="device-info-section-list-item" {...props}>
      <dt>
        {infoName}
      </dt>
      {windowWidth >= WIDTH_TO_SHOW_DEVICE_INFO_DL_SEPARATOR &&
        <div className="device-info-section-item-placeholder" />
      } 
      <dd>
        {type === "link"
          ? <Link to={to} className="link-colors">{info.value}</Link>
          : <span>{info.value}</span>
        }
      </dd>
    </div>
  );
}

export default DeviceInfoSectionListItem;
