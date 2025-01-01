export default function checkIsToRenderViewedDevicesList(viewedDevices) {
  return Array.isArray(viewedDevices) && !!viewedDevices?.length;
}