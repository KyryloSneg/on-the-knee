export default class ArrayActions {

  static isIncludesOrStartsWith(item, array) {
    // array filled with str items
    let result = array.includes(item);

    if (!result) {

      for (let arrItem of array) {
        if (arrItem.startsWith(item)) {
          result = true;
          break;
        }
      }

    }    

    return result;
  }

  static sortStringArray(array) {
    const sortedArr = array.sort( (a, b) => a.localeCompare(b) );
    return sortedArr;
  }

  static sortAlphaNumArray(array) {
    const sortedArr = array.sort( (a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}) );
    return sortedArr;
  }

}