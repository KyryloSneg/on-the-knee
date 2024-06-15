import StringActions from "../utils/StringActions";
import "./styles/DeviceItemInfo.css";

const DeviceItemInfo = ({ deviceInfos, deviceId }) => {
  // we have no need in rendering huge additional info
  const filteredDevInfos = deviceInfos.filter(info => info.name !== "additionalInfo");

  return (
    <ul className="main-device-item-infos">
      {filteredDevInfos.map(info => {
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
