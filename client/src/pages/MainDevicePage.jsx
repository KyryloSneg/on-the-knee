import "./styles/MainDevicePage.css";
import DeviceImagesCarousel from "../components/DeviceImagesCarousel";
import DeviceInfoSection from "../components/DeviceInfoSection";
import DeviceRightDescription from "../components/DeviceRightDescription";
import CommentsSection from "../components/UI/commentsSection/CommentsSection";
import DeviceSalesActions from "../utils/DeviceSalesActions";
import { useContext } from "react";
import { Context } from "../Context";
import useGettingSalesAndTypeNames from "../hooks/useGettingSalesAndTypeNames";
import { observer } from "mobx-react-lite";

const MainDevicePage = observer(({ device, combinationString }) => {
  const { deviceStore } = useContext(Context);
  // theoretically setting sales and sale type names would not lead to bugs in the catalog page
  useGettingSalesAndTypeNames(deviceStore);

  if (!device) {
    return <div />
  }

  const devCombos = device["device-combinations"];
  let selectedCombination;

  if (devCombos.length > 1) {
    selectedCombination = devCombos.find(combo => combo.combinationString === combinationString);
  } else {
    selectedCombination = devCombos[0];
  }

  let deviceSaleTypes = [];
  let textSaleTypes = [];
  let logoSaleTypes = [];

  if (deviceStore.sales?.length && deviceStore.saleTypeNames?.length) {
    deviceSaleTypes = (DeviceSalesActions.getSaleTypesAndDiscount(
      device, deviceStore.sales, deviceStore.saleTypeNames
    )).deviceSaleTypes;

    textSaleTypes = deviceSaleTypes.filter(type => !type.logo);
    logoSaleTypes = deviceSaleTypes.filter(type => type.logo);
  }

  return (
    <section className="main-device-page">
      <div className="dev-images-description-wrap">
        <DeviceImagesCarousel
          device={device}
          selectedCombination={selectedCombination}
          textSaleTypes={textSaleTypes}
          logoSaleTypes={logoSaleTypes}
        />
        <DeviceRightDescription />
      </div>
      <div className="dev-info-comments-wrap">
        <DeviceInfoSection />
        <CommentsSection type="device" />
      </div>
    </section>
  );
});

export default MainDevicePage;
