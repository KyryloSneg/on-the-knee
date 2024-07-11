import { Link } from "react-router-dom";
import DeviceInfoSectionListItem from "./DeviceInfoSectionListItem";
import "./styles/DeviceInfoSectionList.css";
import { DEVICE_INFO_ROUTE } from "../utils/consts";
import getCategoryLinkTo from "../utils/getCategoryLinkTo";
import { useContext } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";

const DeviceInfoSectionList = observer(({ device, deviceInfos, linkDeviceInfoNames, isFullVersion = true, combinationString = null }) => {
  const { deviceStore } = useContext(Context);
  // rendering only 5 device infos if it's not the full version
  let deviceInfosToRender = isFullVersion
    ? deviceInfos
    : deviceInfos.slice(0, 5);

  const isAllInfoRendered = deviceInfosToRender.length === deviceInfos.length;

  let to = "#";
  if (!isAllInfoRendered) {
    const deviceRouteCombo = combinationString
      ? combinationString
      : "default";

    to = DEVICE_INFO_ROUTE.replace(":deviceIdCombo", `${device.id}--${deviceRouteCombo}`);
  }

  return (
    <div className="device-info-section-list-wrap">
      <dl className="device-info-section-list">
        {deviceInfosToRender.map(info => {
          let to = "#";
          const type = linkDeviceInfoNames.includes(info.name)
            ? "link"
            : "span";

          if (type === "link" && deviceStore.categories?.length > 0) {
            const deviceCategory = deviceStore.categories.find(cat => cat.id === device.categoryId);

            to = getCategoryLinkTo(deviceCategory, deviceCategory.parentCategoryId, deviceStore.categories);
            to += `&${info.name}=${info.value}`;
          }

          return (
            <DeviceInfoSectionListItem 
              info={info} 
              type={type} 
              to={to} 
              key={`${device.id}-${info.name}`} 
            />
          );
        })}
      </dl>
      {!isAllInfoRendered &&
        <Link to={to} className="link-colors show-more-device-info-link">
          Show more
        </Link>
      }
    </div>
  );
});

export default DeviceInfoSectionList;
