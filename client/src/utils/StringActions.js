export default class StringActions {

  static removeRedundantSpaces(str) {
    let result = str.trim();
    result = result.split(" ").filter(word => word !== "").join(" ");

    return result
  }

}