import "./styles/DevicePageList.css";
import { useContext, useRef } from "react";
import { Context } from "../Context";
import DeviceList from "./DeviceList";
import { observer } from "mobx-react-lite";
import _ from "lodash";

const DevicePageList = observer(() => {
  const { deviceStore } = useContext(Context);
  const prevPagesRef = useRef({});

  function getPagesObj() {
    let pagesObj = {};

    if (deviceStore.devices.length) {
      const lastCurrentPage = deviceStore.page + deviceStore.pagesToFetch - 1;

      let index = 0;
      for (let currentPage = deviceStore.page; currentPage <= lastCurrentPage; currentPage++) {
        const start = deviceStore.limit * index;
        const end = deviceStore.limit * (index + 1);

        const devices = deviceStore.devices.slice(start, end);

        if (_.isEqual(devices, prevPagesRef.current[currentPage])) {
          pagesObj[currentPage] = prevPagesRef.current[currentPage];
        } else {
          pagesObj[currentPage] = devices;
        }

        index++;
      }
    }

    return pagesObj;
  }

  const pagesObj = getPagesObj();
  prevPagesRef.current = pagesObj;

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
