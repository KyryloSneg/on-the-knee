import "./styles/DevicePageList.css";
import DeviceList from "./DeviceList";
import { observer } from "mobx-react-lite";
import useGettingPagesObj from "hooks/useGettingPagesObj";

const DevicePageList = observer(({ storeToUse }) => {
  const pagesObj = useGettingPagesObj(storeToUse.devices, storeToUse.page, storeToUse.pagesToFetch, storeToUse.limit);

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
