import "./styles/MainPageMainContent.css";
import { useContext } from 'react';
import SalesCarouselSection from "./SalesCarouselSection";
import checkIsToRenderViewedDevicesList from "utils/checkIsToRenderViewedDevicesList";
import ViewedDevicesList from "./ViewedDevicesList";
import { observer } from "mobx-react-lite";
import { Context } from "Context";

const MainPageMainContent = observer(() => {
  const { user } = useContext(Context);

  return (
    <main className="main-page-main-content">
      <SalesCarouselSection />
      {/* this component can be not rendered, and if so, don't render the related section */}
      {checkIsToRenderViewedDevicesList(user.viewedDevices) && (
        <section>
          <h2>
            Viewed devices
          </h2>
          <ViewedDevicesList devicesMaxAmount={60} />
        </section>
      )}
    </main>
  );
});

export default MainPageMainContent;
