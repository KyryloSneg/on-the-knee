const POSSIBLE_DEVICE_INFOS = {
  "smartphones": [
    {
      "processor": "Qualcomm Snapdragon",
      "phoneStorage": "32 GB",
      "refreshRate": "75 hz",
    },
    {
      "processor": "Apple",
      "phoneStorage": "64 GB",
      "refreshRate": "144 hz",
    },
    {
      "processor": "Mediatek",
      "phoneStorage": "128 GB",
      "refreshRate": "240 hz",
    },
    {
      "processor": "Mediatek",
      "phoneStorage": "256 GB",
      "refreshRate": "240 hz",
    },
  ],
  "laptops": [
    {
      "videoCard": "GTX 360 RTX",
    },
    {
      "videoCard": "GTX 1550 TI",
    }
  ],
  "fragrances": [
    {
      "fragrantNote": "Apple",
    },
    {
      "fragrantNote": "Rose",
    }
  ],
  "skincare": [
    {
      "skinType": "dry"
    },
    {
      "skinType": "sensitive",
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
    "phoneStorage": ["32 GB", "64 GB", "128 GB", "256 GB"],
    "color": ["red#FF0000", "purple#A020F0", "green#00FF00"],
  },
  "laptops": {
    "refreshRate": ["75 hz", "144 hz", "240 hz"],
    "color": ["brown#2B1700", "spacedark#333334", "white#FFFFFF"],
  },
  "furniture": {
    "color": ["spacedark#333334", "purple#A020F0", "brown#2B1700", "white#FFFFFF"],
  },
  "tops": {
    "color": ["black#000000", "red#FF0000", "golden#FFD700", "grey#CECECE"],
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

const USERS = [
  {
    "_id": { "$oid": "64e367f69f8167945dcb4a1b" },
    "name": "user",
    "surname": "user",
    "roles": ["PUBLIC", "ORDER-MANAGER", "CONTENT-MANAGER", "SELLER", "OWNER"],
    "email": "onthekneeauth@gmail.com",
    "phoneNumber": "+380 95 532 9384"
  },
];

const POSSIBLE_DELIVERY_TYPES = { "courier": 5, "self-delivery": 0 };
const POSSIBLE_SALE_TYPE_NAMES = [
  {"name": "discount", "bgColor": "#ff1212"},
  {"name": "freeDelivery", "logo": "https://loremflickr.com/40/40?lock=5239500858982400", "bgColor": "#ff1212"}
];
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
};
const POSSIBLE_ORDER_STATUSES = ["Cancelled", "Pending", "Paid", "Confirmed", "Done"];

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
  USERS,

  POSSIBLE_DEVICE_INFOS,
  POSSIBLE_DEVICE_ATTRIBUTES,

  POSSIBLE_DELIVERY_TYPES,
  POSSIBLE_SALE_TYPE_NAMES,
  POSSIBLE_SCHEDULE_TIME_RANGES,
  STORE_LOCATIONS,
  POSSIBLE_ORDER_STATUSES,

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