const DateActions = require("./DateActions");

const POSSIBLE_DEVICE_INFOS = {
  "smartphones": [
    {
      "processor": "Qualcomm Snapdragon",
      "phoneStorage": "32 GB",
      "refreshRate": "75 hz",
      "diagonal": "6.7",
    },
    {
      "processor": "Apple",
      "phoneStorage": "64 GB",
      "refreshRate": "144 hz",
      "diagonal": "6.7",
    },
    {
      "processor": "Mediatek",
      "phoneStorage": "128 GB",
      "refreshRate": "240 hz",
      "diagonal": "6.7",
    },
    {
      "processor": "Mediatek",
      "phoneStorage": "256 GB",
      "refreshRate": "240 hz",
      "diagonal": "6.7",
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
    "color": ["red_FF0000", "purple_A020F0", "green_00FF00"],
  },
  "laptops": {
    "refreshRate": ["75 hz", "144 hz", "240 hz"],
    "color": ["brown_2B1700", "spacedark_333334", "white_FFFFFF"],
  },
  "furniture": {
    "color": ["spacedark_333334", "purple_A020F0", "brown_2B1700", "white_FFFFFF"],
  },
  "tops": {
    "color": ["black_000000", "red_FF0000", "golden_FFD700", "grey_CECECE"],
  },
}

// country => oblast / voivodeship => city => (district || null) && streets => house numbers
const STORE_LOCATIONS = {
  "Ukraine": {
    "Zhytomyrska Oblast": {
      "Zhytomyr": {
        "district": "Zhytomyr district",
        "type": "city",
        "population": 261624,
        "streets": {
          "Velyka Berdychivska Street": [60, 30],
          "Chudnivska Street": [54],
        }
      },

      "Korosten": {
        "district": "Korosten district",
        "type": "city",
        "population": 61496,
        "streets": {
          "Mykhaila Hrushevskoho": [30, 53],
        }
      }
    },

    "Kyivska Oblast": {
      "Kyiv": {
        "district": null,
        "type": "city",
        "population": 2952301,
        "streets": {
          "Khreshchatyk Street": [14, 18],
          "Peremohy Ave": [93, 56],
        }
      },

      "Brovary": {
        "district": "Brovary district",
        "type": "city",
        "population": 109473,
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
        "type": "city",
        "population": 2102324, 
        "streets": {
          "al. Solidarnosci": [61, 32],
        }
      }
    }
  },
}

const MOCK_USER = {
  // i made up the _id below
  "_id": "6348acd2e1a47ca32e79f46f",
  "name": "mock",
  "surname": "user",
  "roles": ["PUBLIC", "ORDER-MANAGER", "CONTENT-MANAGER", "SELLER", "OWNER"],
  "email": "mockuserauth@gmail.com",
  "phoneNumber": "+380 82 0172 6701"
};

const POSSIBLE_DELIVERY_TYPES = { "self-delivery": 0, "courier": 5 };
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
  ],
  4: [
    {
      1: "05:00-11:00",
      2: "11:00-17:00",
      3: "17:00-23:00",
      4: "23:00-05:00",
    },
    {
      1: "00:00-06:00",
      2: "06:00-12:00",
      3: "12:00-18:00",
      4: "18:00-00:00",
    }
  ]
};

const POSSIBLE_SELLER_WORK_SCHEDULES = [
  {
    "Mon-Fri": {
      "start": DateActions.createSimpleDate(11, 0, 0, 0),
      "end": DateActions.createSimpleDate(20, 0, 0, 0)
    },
    "Sat-Sun": {
      "start": DateActions.createSimpleDate(13, 0, 0, 0),
      "end": DateActions.createSimpleDate(19, 0, 0, 0)
    }
  },
  {
    "Mon-Thu": {
      "start": DateActions.createSimpleDate(8, 0, 0, 0),
      "end": DateActions.createSimpleDate(18, 0, 0, 0)
    },
    "Fri-Sun": {
      "start": DateActions.createSimpleDate(9, 0, 0, 0),
      "end": DateActions.createSimpleDate(16, 0, 0, 0)
    }
  },
  {
    "Mon-Tue": {
      "start": DateActions.createSimpleDate(11, 0, 0, 0),
      "end": DateActions.createSimpleDate(22, 0, 0, 0)
    },
    "Wed-Fri": {
      "start": DateActions.createSimpleDate(9, 0, 0, 0),
      "end": DateActions.createSimpleDate(20, 0, 0, 0)
    },
    "Sat-Sun": {
      "start": DateActions.createSimpleDate(10, 0, 0, 0),
      "end": DateActions.createSimpleDate(21, 0, 0, 0)
    }
  }
];

const POSSIBLE_ORDER_STATUSES = ["Canceled", "Pending", "Paid", "Confirmed", "Done"];
const MAIN_CATEGORIES_AMOUNT = 2;
const START_CATEGORIES_NEST_3_AMOUNT = 10;

const LOGO_HEIGHT = 90;
const LOGO_WIDTH = 90;

const MIN_SALE_IMAGE_HEIGHT = 300;
const MIN_SALE_IMAGE_WIDTH = 300;

const MIN_IMAGE_HEIGHT = 200;
const MIN_IMAGE_WIDTH = 300;

const MIN_CATEGORY_IMAGE_HEIGHT = 200;
const MIN_CATEGORY_IMAGE_WIDTH = 300;

const MIN_FEEDBACK_IMAGE_HEIGHT = 900;
const MIN_FEEDBACK_IMAGE_WIDTH = 1000;

const MAX_SALE_IMAGE_HEIGHT = 800;
const MAX_SALE_IMAGE_WIDTH = 800;

const MAX_IMAGE_HEIGHT = 600;
const MAX_IMAGE_WIDTH = 800;

const MAX_CATEGORY_IMAGE_HEIGHT = 400;
const MAX_CATEGORY_IMAGE_WIDTH = 500;

const MAX_FEEDBACK_IMAGE_HEIGHT = 1500;
const MAX_FEEDBACK_IMAGE_WIDTH = 1650;

module.exports = {
  MOCK_USER,

  POSSIBLE_DEVICE_INFOS,
  POSSIBLE_DEVICE_ATTRIBUTES,

  POSSIBLE_DELIVERY_TYPES,
  POSSIBLE_SALE_TYPE_NAMES,
  POSSIBLE_SCHEDULE_TIME_RANGES,
  POSSIBLE_SELLER_WORK_SCHEDULES,
  STORE_LOCATIONS,
  POSSIBLE_ORDER_STATUSES,
  MAIN_CATEGORIES_AMOUNT,
  START_CATEGORIES_NEST_3_AMOUNT,

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