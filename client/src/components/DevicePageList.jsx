import { useContext } from "react";
import { Context } from "../Context";
import DeviceList from "./DeviceList";
import { observer } from "mobx-react-lite";
import "./styles/DevicePageList.css";

// component for future possible optimization
const DevicePageList = observer(() => {
  const { deviceStore } = useContext(Context);

  function renderPages() {
    let pages = [];

    if (deviceStore.devices.length) {
      for (let i = 1; i <= deviceStore.page; i++) {
        const start = deviceStore.limit * (i - 1);
        const end = deviceStore.limit * i;

        const devices = deviceStore.devices.slice(start, end);
        let stocks = [];

        for (let dev of devices) {
          for (let combination of dev["device-combinations"]) {
            const stock = deviceStore.stocks.find(item => item.id === combination.stockId);
            stocks.push(stock);
          }
        }

        const page = {
          "devices": devices,
          "stocks": stocks,
          "sales": deviceStore.sales,
          "saleTypeNames": deviceStore.saleTypeNames,
        }
        pages.push(page);
      }

    }

    return pages;
  }

  const pages = renderPages();
  return (
    <ul className="main-device-page-list">
      {pages.map((page, index) =>
        <li key={`main-device-page: ${index + 1}`}>
          <DeviceList 
            devices={page.devices} 
            stocks={page.stocks} 
            sales={page.sales} 
            saleTypeNames={page.saleTypeNames} 
          />
        </li>
      )}
    </ul>
  );
});

export default DevicePageList;
