const POSSIBLE_COLORS = [
  [
    {
      name: "red",
      value: "#FF0000",
    },
    {
      name: "purple",
      value: "#A020F0",
      default: true,
    },
    {
      name: "green",
      value: "#00FF00",
    },
  ],
  [
    {
      name: "brown",
      value: "2B1700",
      default: true,
    },
  ],
  [
    {
      name: "space-dark",
      value: "#333334"
    },
    {
      name: "white",
      value: "#FFFFFF",
      default: true,
    },
  ],
  [
    {
      name: "black",
      value: "#000000",
      default: true,
    },
    {
      name: "red",
      value: "#FF0000",
    },
    {
      name: "golden",
      value: "#FFD700",
    },
    {
      name: "grey",
      value: "#CECECE",
    }
  ],
  [
    {
      name: "space-dark",
      value: "#333334",
      default: true,
    },
  ],
  [
    {
      name: "purple",
      value: "#A020F0",
      default: true,
    },
  ],
  [
    {
      name: "brown",
      value: "#2B1700",
    },
    {
      name: "white",
      value: "#FFFFFF",
      default: true,
    }
  ],
  [
    {
      name: "darkcherryred",
      value: "#330000",
      default: true,
    },
  ],
  [], // colorItems array can be empty
];

const POSSIBLE_DEVICE_INFOS = {
  "smartphones": [
    {
      "processor": "Qualcomm Snapdragon",
      "phone-storage": "32GB",
      "additional-info": "Aliquam enim ipsum, ultricies non imperdiet eu, scelerisque sit amet augue. Vestibulum tincidunt vulputate dignissim. Vestibulum placerat sem non velit mattis, sit amet molestie nulla rhoncus."
    },
    {
      "processor": "Apple",
      "phone-storage": "128GB",
    },
    {
      "processor": "Mediatek",
      "phone-storage": "256GB",
    },
  ],
  "laptops": [
    {
      "hz": "75",
      "video-card": "GTX 360 RTX",
    },
    {
      "hz": "140",
      "video-card": "GTX 1550 TI",
      "additional-info": "Suspendisse accumsan feugiat tellus, sit amet accumsan dui dignissim non. Donec in lobortis orci. Fusce ultricies sed velit ut finibus."
    }
  ],
  "fragrances": [
    {
      "fragrant-note": "Apple",
      "additional-info": "Duis commodo velit volutpat, sodales metus sed, ornare metus. Aenean condimentum dolor quis libero aliquam luctus."
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
      "additional-info": "Vivamus rhoncus urna metus, eget lobortis odio convallis eu. Mauris vitae enim eu diam molestie scelerisque."
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
      "additonalInfo": "Suspendisse tempus bibendum luctus. Integer arcu ex"
    }
  ],
};

module.exports = {
  POSSIBLE_COLORS: POSSIBLE_COLORS,
  POSSIBLE_DEVICE_INFOS: POSSIBLE_DEVICE_INFOS,
}