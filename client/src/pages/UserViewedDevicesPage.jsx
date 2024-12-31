import "./styles/UserViewedDevicesPage.css";
import { useContext } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import Loader from "../components/UI/loader/Loader";
import DeviceList from "../components/DeviceList";
import _ from "lodash";
import UIButton from "../components/UI/uiButton/UIButton";
import { ROOT_ROUTE } from "../utils/consts";

const UserViewedDevicesPage = observer(() => {
  const { app, user } = useContext(Context);
  if (!app.hasTriedToFetchInitialData) return (
    <section className="user-page-section user-viewed-device-page">
      <h2>
        Viewed devices
      </h2>
      <Loader className="user-page-loader" />
    </section>
  );

  let devices = [];
  if (Array.isArray(user.viewedDevices)) {
    for (let viewedDev of user.viewedDevices) {
      const deviceToPush = _.cloneDeep(viewedDev.device);
      // making it possible to use certain dev combo in the DeviceList 
      deviceToPush.deviceCombinationId = viewedDev["device-combinationId"];

      devices.push(deviceToPush);
    }
  }

  return (
    <section className="user-page-section user-viewed-device-page">
      <h2>
        Viewed devices
      </h2>
      {devices?.length || false
        ? <DeviceList devices={devices} areDevsWithCertainDevComboId={true} withHistoryDeletionBtn={true} />
        : (
          <section className="user-page-no-data-msg-section">
            <h3>
              You haven't checked anything out there
            </h3>
            <p className="user-page-no-data-msg">
              Look at our wonderful devices
            </p>
            <UIButton isLink={true} to={ROOT_ROUTE}>
              Revise it
            </UIButton>
          </section>
        )
      }
    </section>
  );
});

export default UserViewedDevicesPage;
