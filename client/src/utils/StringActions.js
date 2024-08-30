export default class StringActions {

  static capitalize(str) {
    let result = "";
    if (str?.length) result = str[0]?.toUpperCase() + str.slice(1);
    
    return result;
  }

  static removeRedundantSpaces(str) {
    let result = str.trim();
    result = result.split(" ").filter(word => word !== "").join(" ").trim();

    return result
  }

  // str is camelCase
  static splitByUpperCaseLetters(str) {
    let splittedString = "";

    for (let char of str) {
      if (char.match(/[A-Z]/)) {
        splittedString += ` ${char.toLowerCase()}`;
      } else {
        splittedString += char;
      }
    }

    return splittedString;
  }

}