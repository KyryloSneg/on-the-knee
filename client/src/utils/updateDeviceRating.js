import { patchDevice } from "http/DeviceApi";

export default async function updateDeviceRating(updatedDeviceFeedbacks, deviceId) {
  // idk what to do if the fetch has returned something wrong
  if (Array.isArray(updatedDeviceFeedbacks)) {
    // if we have deleted the last feedback, set zero rating
    if (!updatedDeviceFeedbacks.length) {
      await patchDevice(deviceId, { rating: "0.0" });
      return;
    }

    const feedbacksRatingSum = updatedDeviceFeedbacks?.reduce((acc, currValue) => acc + currValue.rate, 0);
    const newRating = (feedbacksRatingSum / updatedDeviceFeedbacks.length).toFixed(1);

    // we can't update device state immediately from the device page,
    // because it will invoke 1 billion re-renders that i don't want to handle
    await patchDevice(deviceId, { rating: newRating });
  }
}