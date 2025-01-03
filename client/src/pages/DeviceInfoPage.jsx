import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";
import DeviceInfoSection from "../components/DeviceInfoSection";

const DeviceInfoPage = ({ device }) => {
  useSettingDocumentTitle(`Information about ${device?.name || "..."}`);

  return (
    <DeviceInfoSection device={device} />
  );
}

export default DeviceInfoPage;
