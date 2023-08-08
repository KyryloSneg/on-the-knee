const StringActions = require("./StringActions");

module.exports = function iter(item, combinationStrings, initialItem = []) {

  if (!initialItem.length) { 
    // we have to make the condition to ensure that we have access 
    // to initialItems every call of the function (except for the first one)
    initialItem = item;
  }
  
  if (Array.isArray(item) && !item.length) { // if a device doesn't have any attributes we return null
    return null;
  } else if (initialItem.length === 1) { // if we have only one group of attributes we can just return their names as combinationStrings items
    for (let str of initialItem[0]) {
      combinationStrings.push(StringActions.nameToDeviceCombination(str));
    }
  } else {
    const arr = Array.isArray(item[0]) ? item[0] : item;
    const nextItem = initialItem.slice(initialItem.indexOf(arr) + 1); 
    // item: [ ["attr1", "attr2", "attr3"], ["attr1", "attr2"] ]
    // nextItem = [ ["attr1", "attr2"] ]

    if (!nextItem.length) return arr;

    let combos = [];
    const nextStrings = iter(nextItem, combinationStrings, initialItem);

    for (let str of arr) {
      combos.push(...nextStrings.map(nextStr => str + "-" + StringActions.nameToDeviceCombination(nextStr)));
    }

    if (arr === initialItem[0]) { // if recursion ends we pushing all combos into combinationStrings array
      for (let combo of combos) {
        combinationStrings.push(combo);
      }
    }

  }

}