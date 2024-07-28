import "./styles/AdditionalServicesSection.css";
import AdditionalServicesList from "./AdditionalServicesList";

// additional services is obj made of different fetches' data:

// [
//   {
//     "id": 4,
//     "deviceId": 9,
//     "name": "Red Lipstick",
//     "additional-serviceId": 4,
//     "additional-service": {
//       "id": 4,
//       "deviceId": 4,
//       "names": [
//         "Awesome Granite Shirt 1"
//       ],
//       "device": {
//         "id": 4,
//         "name": "Red Lipstick",
//         "rating": "4.9",
//         "description": "The Red Lipstick is a classic and bold choice for adding a pop of color to your lips. With a creamy and pigmented formula, it provides a vibrant and long-lasting finish.",
//         "brandId": 9,
//         "categoryId": 10,
//         "sellerId": 10,
//         "isPreOrder": false,
//         "device-combinations": [
//           {
//             "id": 9,
//             "combinationString": null,
//             "deviceId": 4,
//             "sku": "etOe7SFSxGH",
//             "deviceCode": 971685781,
//             "stockId": 9,
//             "price": "804.00",
//             "thumbnail": "https://loremflickr.com/547/330?lock=6681266759925760",
//             "images": [
//               {
//                 "src": "https://loremflickr.com/547/330?lock=4603628249677824",
//                 "alt": "Usus verecundia curo vetus cupressus depono enim curo cumque voco."
//               },
//               {
//                 "src": "https://picsum.photos/seed/mmzmoGN28X/547/330",
//                 "alt": "Antepono molestiae aetas ver curiositas benigne."
//               },
//               {
//                 "src": "https://picsum.photos/seed/mHlu4oLo/547/330",
//                 "alt": "Textus vereor taceo altus velum apto exercitationem crepusculum."
//               },
//               {
//                 "src": "https://picsum.photos/seed/GSBXKS/547/330",
//                 "alt": "Voluptatem voluptatum coniecto valeo venia aegre artificiose corona pecto."
//               }
//             ],
//             "default": true
//           }
//         ]
//       }
//     }
//   },
//   ...
// ]

// id is our index from .map() method
// selectedItems = [
//   {
//     id: 1,
//     parentId: 0,
//     price: 419.00
//   },
//   {
//     id: 3,
//     parentId: 1,
//     price: 419.00
//   },
//   ...
// ];

const AdditionalServicesSection = ({ additionalServices, selectedItems, setSelectedItems }) => {
  let isDataLoaded = false;
  if (additionalServices?.length) {
    // checking this condition because in some point our data loses its "additional-service" field
    isDataLoaded = !!additionalServices[0]["additional-service"];
  }
  // let isDataLoaded = additionalServices?.length;
  if (!isDataLoaded) return <div />;

  let totalPrice = 0;
  if (selectedItems?.length) {
    totalPrice = selectedItems.reduce(
      (accumulator, currentItem) => accumulator + +currentItem.price,
      0,
    );
  }

  const serviceWord = selectedItems.length === 1 ? "service" : "services";
  return (
    <section className="additional-services-section">
      <h3>
        Additional services
        {totalPrice > 0 &&
          <span className="add-services-section-price">
            (<b>{selectedItems.length}</b> {serviceWord} for <strong>{totalPrice.toFixed(2)}$</strong>)
          </span>
        }
      </h3>
      <AdditionalServicesList
        additionalServices={additionalServices}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
    </section>
  );
}

export default AdditionalServicesSection;
