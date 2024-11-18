import { patchDevice } from "http/DeviceApi";

export default async function updateDeviceRating(updatedDeviceFeedbacks) {
  // idk what to do if the fetch has returned something wrong
  if (Array.isArray(updatedDeviceFeedbacks)) {
    const feedbacksRatingSum = updatedDeviceFeedbacks?.reduce((acc, currValue) => acc + currValue.rate, 0);
    const newRating = (feedbacksRatingSum / updatedDeviceFeedbacks.length).toFixed(1);

    // we can't update device state immediately from the device page,
    // because it will invoke 1 billion re-renders that i don't want to handle
    await patchDevice(updatedDeviceFeedbacks[0]?.deviceId, { rating: newRating });
  }
}