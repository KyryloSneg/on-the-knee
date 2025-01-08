import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";
import DeviceInfoSection from "../components/DeviceInfoSection";
import MetaTagsInPublicRoute from "components/MetaTagsInPublicRoute";

const DeviceInfoPage = ({ device }) => {
  useSettingDocumentTitle(`Information about ${device?.name || "..."}`);

  return (
    <>
      <MetaTagsInPublicRoute 
        description={`Info about ${device?.name} in On the knee store.`} 
        keywords={`device, info, ${device?.name}`} 
        isToRender={device?.name}
      />
      <DeviceInfoSection device={device} />
    </>
  );
}

export default DeviceInfoPage;
