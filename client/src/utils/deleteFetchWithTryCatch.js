export default async function deleteFetchWithTryCatch(asyncCb) {
  try {
    await asyncCb();
  } catch (e) {
    if (e.response.status !== 500) {
      throw e;
    }
  }
}