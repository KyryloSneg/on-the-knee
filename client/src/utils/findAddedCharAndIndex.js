// works only for one added char (so can be used in onChange handlers)
function findAddedCharAndIndex(oldStr, newStr) {
  let addedChar = null;
  let addedIndex = null;

  // char could be replaced so use <=, not just <
  if (oldStr.length <= newStr.length) {
    // added a char
    for (let [index, newChar] of newStr.split("").entries()) {
      if (oldStr.length <= index || oldStr[index] !== newChar) {
        addedChar = newChar;
        addedIndex = index;
        break;
      }
    } 
  }
  // otherwise can't handle it

  return { addedChar, index: addedIndex };
}

export default findAddedCharAndIndex;