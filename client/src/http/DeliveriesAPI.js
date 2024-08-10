import { $mockApi } from "./index";

export async function getDeliveries(cityId) {
  const { data: deliveriesData } = await $mockApi.get(`/deliveries?cityId=${cityId}`);

  let result = await Promise.all(deliveriesData.map(async delivery => {
    const { data: deliveryType } = await $mockApi.get(`/delivery-types?id=${delivery["delivery-typeId"]}`);
    return {
      ...delivery,
      name: deliveryType[0]?.name,
    };
  }));

  return result;
}

export async function getOneDelivery(id) {
  const { data: delivery } = await $mockApi.get(`/deliveries/` + id);
  const { data: deliveryType } = await $mockApi.get(`/delivery-types?id=${delivery["delivery-typeId"]}`);

  return {
    ...delivery,
    name: deliveryType[0]?.name,
  };
}