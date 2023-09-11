export default class StringActions {

  static capitalize(str) {
    const result = str[0].toUpperCase() + str.slice(1);
    return result;
  }

  static removeRedundantSpaces(str) {
    let result = str.trim();
    result = result.split(" ").filter(word => word !== "").join(" ");

    return result
  }

}