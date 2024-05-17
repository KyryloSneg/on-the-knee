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

  if (!device || !deviceStore.sales.length || !deviceStore.stocks.length) {
    return <div />
  }

  const devCombos = device["device-combinations"];
  const defaultCombo = devCombos.find(combo => combo.default);
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

  const salesIds = device["sale-devices"].map(saleDev => saleDev.saleId);
  const sales = deviceStore.sales.filter(sale => salesIds.includes(sale.id));
  
  let salesAndTypes = [];
  for (let sale of sales) {
    const saleAndTypeObj = {
      sale: sale,
      saleTypes: deviceSaleTypes.filter(type => type.saleId === sale.id),
    }

    salesAndTypes.push(saleAndTypeObj);
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
        <DeviceRightDescription
          device={device}
          selectedCombination={selectedCombination}
          defaultCombo={defaultCombo}
          salesAndTypes={salesAndTypes}
        />
      </div>
      <div className="dev-info-comments-wrap">
        <DeviceInfoSection />
        <CommentsSection type="device" />
      </div>
    </section>
  );
});

export default MainDevicePage;
