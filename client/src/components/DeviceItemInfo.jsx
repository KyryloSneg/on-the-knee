import StringActions from "../utils/StringActions";
import "./styles/DeviceItemInfo.css";

const DeviceItemInfo = ({ deviceInfos, deviceId }) => {
  return (
    <ul className="main-device-item-infos">
      {deviceInfos.map(info => {
        let name = StringActions.splitByUpperCaseLetters(info.name);
        name = StringActions.capitalize(name);
        const value = StringActions.capitalize(info.value);

        return (
          <li key={`device-item-info ${deviceId}/${name}:${value}`}>
            <p className="main-device-item-info">
              <b>{name}</b>: {value}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

export default DeviceItemInfo;
