module.exports = class StringActions {

  static capitalize(str) {
    const result = str[0].toUpperCase() + str.slice(1);
    return result;
  }

  static nameToDeviceCombination(name) {
    let deviceCombinationPart = name.split(" ")[0].split("-").join("").toLowerCase();
    return deviceCombinationPart; 
  }

  static nameToSlug(name) {
    let slug = name.replace( /\p{P}/gu, "").split(" "); // deleting every punctuation mark
    slug = slug.filter(word => word); // delete every empty string
    slug = slug.join("-").toLowerCase();

    return slug
  }

  static slugToName(slug) {
    let name = slug.split("-").join(" ");
		name = this.capitalize(name);

    return name;
  }

}