import pluralize from "pluralize";
import ArrayActions from "./ArrayActions";
import StringActions from "./StringActions";

export default function filterSearchResultFn(res, value, isDefault = true) {
  value = value.toLowerCase().trim();
  res = res.toLowerCase();

  let singularValue = "";
  let singularRes = "";

  for (let val of value.split(" ")) {
    singularValue += pluralize.singular(val) + " ";
  }
  
  for (let result of res.split(" ")) {
    singularRes += pluralize.singular(result) + " ";
  }

  singularValue = StringActions.removeRedundantSpaces(singularValue);
  singularRes = StringActions.removeRedundantSpaces(singularRes);
  
  let isSuitable = false;
  if (isDefault) {
    // if our value isn't empty and a result length is greater than input value's one:
    // check is a result starts with our value or not  
    // otherwise it's false
    isSuitable = value.length && res.length > value.length ? res.startsWith(value) : false;
  } else if (value.length) {
    isSuitable = true;

    const queryWords = value.split(" ");
    const singularValueWords = singularValue.split(" ");
    const singularResWords = singularRes.split(" ");
    
    if (!queryWords.length) {
      isSuitable = false;
    }

    for (let i = 0; i < queryWords.length; i++) {
      if (
          !ArrayActions.isIncludesOrStartsWith(queryWords[i], res.split(" ")) &&
          !ArrayActions.isIncludesOrStartsWith(singularValueWords[i], singularResWords)
         ) {
        isSuitable = false;
        break;
      }
    }

  }

  return isSuitable;
}  