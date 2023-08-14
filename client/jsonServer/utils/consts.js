// const POSSIBLE_COLORS = [
//   [
//     {
//       name: "red",
//       value: "#FF0000",
//     },
//     {
//       name: "purple",
//       value: "#A020F0",
//       default: true,
//     },
//     {
//       name: "green",
//       value: "#00FF00",
//     },
//   ],
//   [
//     {
//       name: "brown",
//       value: "2B1700",
//       default: true,
//     },
//   ],
//   [
//     {
//       name: "space-dark",
//       value: "#333334"
//     },
//     {
//       name: "white",
//       value: "#FFFFFF",
//       default: true,
//     },
//   ],
//   [
//     {
//       name: "black",
//       value: "#000000",
//       default: true,
//     },
//     {
//       name: "red",
//       value: "#FF0000",
//     },
//     {
//       name: "golden",
//       value: "#FFD700",
//     },
//     {
//       name: "grey",
//       value: "#CECECE",
//     }
//   ],
//   [
//     {
//       name: "space-dark",
//       value: "#333334",
//       default: true,
//     },
//   ],
//   [
//     {
//       name: "purple",
//       value: "#A020F0",
//       default: true,
//     },
//   ],
//   [
//     {
//       name: "brown",
//       value: "#2B1700",
//     },
//     {
//       name: "white",
//       value: "#FFFFFF",
//       default: true,
//     }
//   ],
//   [
//     {
//       name: "darkcherryred",
//       value: "#330000",
//       default: true,
//     },
//   ],
//   [], // colorItems array can be empty
// ];

const POSSIBLE_DEVICE_INFOS = {
  "smartphones": [
    {
      "processor": "Qualcomm Snapdragon",
      "phone-storage": "32GB",
      "hz": "75",
    },
    {
      "processor": "Apple",
      "phone-storage": "64GB",
      "hz": "144",
    },
    {
      "processor": "Mediatek",
      "phone-storage": "128GB",
      "hz": "240",
    },
    {
      "processor": "Mediatek",
      "phone-storage": "256GB",
      "hz": "240",
    },
  ],
  "laptops": [
    {
      "video-card": "GTX 360 RTX",
    },
    {
      "video-card": "GTX 1550 TI",
    }
  ],
  "fragrances": [
    {
      "fragrant-note": "Apple",
    },
    {
      "fragrant-note": "Rose",
    }
  ],
  "skincare": [
    {
      "skin-type": "dry"
    },
    {
      "skin-type": "sensitive",
    },
  ],
  "groceries": [
    {
      "type": "grain"
    },
    {
      "type": "vegetable"
    }
  ],
  "home-decoration": [
    {
      "holiday": "Halloween",
    },
    {
      "holiday": "New Year",
    },
  ],
  "furniture": [
    {
      "material": "wood"
    },
    {
      "material": "stone"
    }
  ],
  "tops": [
    {
      "material": "cotton"
    },
    {
      "material": "synthetic",
    }
  ],
};

const POSSIBLE_DEVICE_ATTRIBUTES = {
  "smartphones": {
    "phone-storage": ["32GB", "64GB", "128GB", "256GB"],
    "color": ["red #FF0000", "purple #A020F0", "green #00FF00"],
  },
  "laptops": {
    "hz": ["75", "144", "240"],
    "color": ["brown #2B1700", "space-dark #333334", "white #FFFFFF"],
  },
  "furniture": {
    "color": ["space-dark #333334", "purple #A020F0", "brown #2B1700", "white #FFFFFF"],
  },
  "tops": {
    "color": ["black #000000", "red #FF0000", "golden #FFD700", "grey #CECECE"],
  },
}

// country => oblast / voivodeship => city => (district || null) && streets => house numbers
const STORE_LOCATIONS = {
  "Ukraine": {
    "Zhytomyr Oblast": {
      "Zhytomyr": {
        "district": "Zhytomyr district",
        "type": "big-city",
        "streets": {
          "Velyka Berdychivska Street": [60, 30],
          "Chudnivska Street": [54],
        }
      },

      "Korosten'": {
        "district": "Korosten' district",
        "type": "city",
        "streets": {
          "Mykhaila Hrushevskoho": [30, 53],
        }
      }
    },

    "Kyiv Oblast": {
      "Kyiv": {
        "district": null,
        "type": "big-city",
        "streets": {
          "Khreshchatyk Street": [14, 18],
          "Peremohy Ave": [93, 56],
        }
      },

      "Brovary": {
        "district": "Brovary district",
        "type": "city",
        "streets": {
          "Kyiv Street": [160, 180],
        },
      }
    },
  },

  "Poland": {
    "Lublin Voivodeship": {
      "Lublin": {
        "district": "Lublin County",
        "type": "big-city",
        "streets": {
          "al. Solidarnosci": [61, 32],
        }
      }
    }
  },
}
const POSSIBLE_DELIVERY_TYPES = { "courier": 5, "self-delivery": 0 }; 
const POSSIBLE_SALE_TYPE_NAMES = ["discount", "freeDelivery"];
const POSSIBLE_SCHEDULE_TIME_RANGES = {
  2: [
    {
      1: "10:00-16:00",
      2: "16:00-22:00",
    },
    {
      1: "11:00-17:00",
      2: "17:00-23:00",
    },
    {
      1: "9:00-15:00",
      2: "15:00-21:00",
    }
  ]
}

const LOGO_HEIGHT = 40;
const LOGO_WIDTH = 40;

const MIN_SALE_IMAGE_HEIGHT = 300;
const MIN_SALE_IMAGE_WIDTH = 300;

const MIN_IMAGE_HEIGHT = 200;
const MIN_IMAGE_WIDTH = 300;

const MIN_CATEGORY_IMAGE_HEIGHT = 200;
const MIN_CATEGORY_IMAGE_WIDTH = 300;

const MIN_FEEDBACK_IMAGE_HEIGHT = 150;
const MIN_FEEDBACK_IMAGE_WIDTH = 200;

const MAX_SALE_IMAGE_HEIGHT = 800;
const MAX_SALE_IMAGE_WIDTH = 800;

const MAX_IMAGE_HEIGHT = 600;
const MAX_IMAGE_WIDTH = 800;

const MAX_CATEGORY_IMAGE_HEIGHT = 400;
const MAX_CATEGORY_IMAGE_WIDTH = 500;

const MAX_FEEDBACK_IMAGE_HEIGHT = 350;
const MAX_FEEDBACK_IMAGE_WIDTH = 400;

module.exports = {
  POSSIBLE_DEVICE_INFOS,
  POSSIBLE_DEVICE_ATTRIBUTES,

  POSSIBLE_DELIVERY_TYPES,
  POSSIBLE_SALE_TYPE_NAMES,
  POSSIBLE_SCHEDULE_TIME_RANGES,
  STORE_LOCATIONS,

  LOGO_HEIGHT,
  LOGO_WIDTH,

  MIN_SALE_IMAGE_HEIGHT,
  MIN_SALE_IMAGE_WIDTH,

  MIN_IMAGE_HEIGHT,
  MIN_IMAGE_WIDTH,

  MIN_CATEGORY_IMAGE_HEIGHT,
  MIN_CATEGORY_IMAGE_WIDTH,

  MIN_FEEDBACK_IMAGE_HEIGHT,
  MIN_FEEDBACK_IMAGE_WIDTH,

  MAX_SALE_IMAGE_HEIGHT,
  MAX_SALE_IMAGE_WIDTH,

  MAX_IMAGE_HEIGHT,
  MAX_IMAGE_WIDTH,

  MAX_CATEGORY_IMAGE_HEIGHT,
  MAX_CATEGORY_IMAGE_WIDTH,
  
  MAX_FEEDBACK_IMAGE_HEIGHT,
  MAX_FEEDBACK_IMAGE_WIDTH,
}