import "./styles/DevicePageList.css";
import { useContext } from "react";
import { Context } from "../Context";
import DeviceList from "./DeviceList";
import { observer } from "mobx-react-lite";
import useGettingPagesObj from "hooks/useGettingPagesObj";

const DevicePageList = observer(() => {
  const { deviceStore } = useContext(Context);
  const pagesObj = useGettingPagesObj(deviceStore.devices, deviceStore.page, deviceStore.pagesToFetch, deviceStore.limit);

  return (
    <ul className="main-device-page-list">
      {Object.entries(pagesObj).map(([key, value]) =>
        <li key={`main-device-page: ${key}`}>
          <DeviceList devices={value} />
        </li>
      )}
    </ul>
  );
});

export default DevicePageList;
