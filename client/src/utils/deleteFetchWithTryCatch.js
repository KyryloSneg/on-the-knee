export default async function deleteFetchWithTryCatch(asyncCb, isToThrowError = true) {
  try {
    await asyncCb();
  } catch (e) {
    if (e.response.status !== 500 && isToThrowError) {
      throw e;
    } else if (!isToThrowError) {
      return e.message;
    }
  }
}