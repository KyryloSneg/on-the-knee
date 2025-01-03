import "./styles/UserViewedDevicesPage.css";
import { useContext } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import Loader from "../components/UI/loader/Loader";
import UIButton from "../components/UI/uiButton/UIButton";
import { ROOT_ROUTE } from "../utils/consts";
import ViewedDevicesList from "components/ViewedDevicesList";
import checkIsToRenderViewedDevicesList from "utils/checkIsToRenderViewedDevicesList";
import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";

const UserViewedDevicesPage = observer(() => {
  useSettingDocumentTitle("Viewed devices");

  const { app, user } = useContext(Context);
  if (!app.hasTriedToFetchInitialData) return (
    <section className="user-page-section user-viewed-device-page">
      <h2>
        Viewed devices
      </h2>
      <Loader className="user-page-loader" />
    </section>
  );

  return (
    <section className="user-page-section user-viewed-device-page">
      <h2>
        Viewed devices
      </h2>
      {checkIsToRenderViewedDevicesList(user.viewedDevices)
        ? <ViewedDevicesList />
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
