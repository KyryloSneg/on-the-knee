import "./styles/DesiredListPage.css";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../Context";
import DeviceList from "../components/DeviceList";
import UIButton from "../components/UI/uiButton/UIButton";
import { DESIRED_LIST_PAGE_OPTIONS, ROOT_ROUTE } from "../utils/consts";
import Dropdown from "../components/UI/dropdown/Dropdown";
import _ from "lodash";
import sortDevicesByPrice from "../utils/sortDevicesByPrice";
import compareNumbers from "../utils/compareNumbers";
import Loader from "../components/UI/loader/Loader";

const DesiredListPage = observer(({ selectedOptionId, setSelectedOptionId }) => {
  const { app, user, deviceStore } = useContext(Context);

  if (!app.hasTriedToFetchInitialData) return (
    <section className="user-page-section desired-list-page">
      <header>
        <h2>
          Desired list
        </h2>
      </header>
      <Loader className="user-page-loader" />
    </section>
  );

  const selectedOption = DESIRED_LIST_PAGE_OPTIONS.find(option => option.id === selectedOptionId);

  let devices = [];
  if (Array.isArray(user.desiredListDevices)) {
    for (let listDevice of user.desiredListDevices) {
      const deviceToPush = _.cloneDeep(listDevice.device);
      // adding this field to sort devices by date in the future
      deviceToPush.addedToDesiredListDate = listDevice.date;
      // making it possible to use certain dev combo in the DeviceList 
      // and in sorting devices by price
      deviceToPush.deviceCombinationId = listDevice["device-combinationId"];

      devices.push(deviceToPush);
    }
  }

  let sortedDevices = [];
  if (devices.length) {
    // ["desc", "price"]
    const splittedSortFilter = selectedOption?.value.split(",");

    sortedDevices = _.cloneDeep(devices);
    let isToReverse = splittedSortFilter?.[0] === "desc";

    if (splittedSortFilter?.[1] === "price") {
      sortDevicesByPrice(
        sortedDevices, deviceStore.stocks, deviceStore.sales, deviceStore.saleTypeNames, deviceStore.hasTriedToFetchSales,
        splittedSortFilter[0] === "desc", true
      );

      isToReverse = false;
    } else if (splittedSortFilter?.[1] === "rating") {
      sortedDevices.sort((a, b) => compareNumbers(+a.rating, +b.rating));
    } else if (splittedSortFilter?.[1] === "date") {
      sortedDevices.sort((a, b) => a.addedToDesiredListDate.localeCompare(b.addedToDesiredListDate));
    }

    // we can do reverse sorting in the sorting functions above but it's less readable
    // than reversing it in the end of the hook (it won't hurt optimization much)
    if (isToReverse) {
      sortedDevices.reverse();
    }
  };

  return (
    <section className="user-page-section desired-list-page">
      <header>
        <h2>
          Desired list
        </h2>
      </header>
      {sortedDevices?.length
        ? (
          <>
            <Dropdown
              options={DESIRED_LIST_PAGE_OPTIONS}
              placeHolder="Sort devices"
              propsSelectedId={selectedOptionId}
              onSelectCb={id => setSelectedOptionId(id)}
            />
            <DeviceList devices={sortedDevices} areDevsWithCertainDevComboId={true} />
          </>
        )
        : (
          <section className="user-page-no-data-msg-section">
            <header>
              <h3>
                The list is empty
              </h3>
            </header>
            <p className="user-page-no-data-msg">
              Add here some lovely devices
            </p>
            <UIButton isLink={true} to={ROOT_ROUTE}>
              Choose them
            </UIButton>
          </section>
        )
      }
    </section>
  );
});

export default DesiredListPage;
