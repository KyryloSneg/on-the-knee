import ArrayActions from "./ArrayActions";
import { SPECIAL_QUERY_PARAMS } from "./consts";

export default class URLActions {

  // static deleteEmptyParamValues(searchParams, paramPairs) {

  //   for (let [key, value] of paramPairs) {
  //     if (!!value.trim()) continue;
  //     searchParams.delete(key);
  //   }

  // }

  static generateNewURL(url, searchParams) {
    const urlWithoutParams = url.origin + url.pathname;
    let newUrl;

    if (searchParams.toString()) {
      newUrl = `${urlWithoutParams}?${searchParams.toString()}`;
    } else {
      newUrl = urlWithoutParams;
    }
    
    return newUrl;
  }

  static addParamValue(name, value) {
    const decodedURL = decodeURIComponent(window.location.href);
    const url = new URL(decodedURL);
    const searchParams = new URLSearchParams(url.search);
    const isNameAlreadyExists = searchParams.has(name);

    if (isNameAlreadyExists) {

      const paramPairs = Array.from(url.searchParams.entries());
      for (let [key, pairValue] of paramPairs) {
        if (key !== name) continue;
        // if a value was "apple" and new value is "orange" we'll get "apple,orange" param value
        // (do not forget about auto encoding url)
        const valueArray = [...pairValue.split(","), value];
        const sortedValueArray = ArrayActions.sortStringArray(valueArray);
        const newValue = sortedValueArray.join(",");

        searchParams.set(key, newValue)
      }

    } else {
      searchParams.set(name, value);
      searchParams.sort();
    }

    const newUrl = this.generateNewURL(url, searchParams);
    return newUrl;
  }

  static deleteParamValue(name, value) {
    const decodedURL = decodeURIComponent(window.location.href);
    const url = new URL(decodedURL);
    const searchParams = new URLSearchParams(url.search);
    const isMultipleValues = searchParams.get(name)?.split(",").length > 1;

    if (isMultipleValues) {
      const paramValue = searchParams.get(name);
      const strToReplace = paramValue.startsWith(value) ? `${value},` : `,${value}`;

      // if a value was "apple,orange" and value to delete is "orange" we'll get "apple" param value
      const newValue = paramValue.replace(strToReplace, "");
      searchParams.set(name, newValue);

    } else {
      searchParams.delete(name);
    }

    const newUrl = this.generateNewURL(url, searchParams);
    return newUrl;
  }

  static deleteAllDefaultParamValues() {
    const decodedURL = decodeURIComponent(window.location.href);
    const url = new URL(decodedURL);
    const searchParams = new URLSearchParams(url.search);
    const paramPairs = Array.from(url.searchParams.entries());
    
    for (let [key] of paramPairs) {
      if (SPECIAL_QUERY_PARAMS.includes(key)) continue;
      searchParams.delete(key);
    }

    const newUrl = this.generateNewURL(url, searchParams);
    return newUrl;
  }

  static setNewParam(name, value) {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);

    searchParams.set(name, value);
    searchParams.sort();

    const newUrl = this.generateNewURL(url, searchParams);
    return newUrl;
  }

  static getParamValue(name) {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);

    const value = searchParams.get(name);
    return value;
  }

  static getUsedFilters(filters) {
    const decodedURL = decodeURIComponent(window.location.href);
    const url = new URL(decodedURL);
    const searchParams = new URLSearchParams(url.search);
    
    let usedFilters = {};
    for (let [key, value] of searchParams.entries()) {
      if (SPECIAL_QUERY_PARAMS.includes(key)) continue;

      let filterValues = [];
      for (let val of value.split(",")) {
        filterValues.push(val);
      }

      usedFilters[key] = filterValues;
    }

    const newUrl = this.deleteAllRedundantFilters(filters, usedFilters);
    return { usedFilters, url: newUrl };
  }

  static deleteAllRedundantFilters(filters, usedFilters) {
    const decodedURL = decodeURIComponent(window.location.href);
    const url = new URL(decodedURL);
    const searchParams = new URLSearchParams(url.search);

    for (let [key, values] of Object.entries(usedFilters)) {
      
      // idk how to separate the price filter from the other ones in this case
      if (SPECIAL_QUERY_PARAMS.includes(key) || key === "price") continue;

      for (let val of values) {
        if (!filters[key]?.includes(val)) {
          searchParams.delete(key);
          delete usedFilters[key];
          break;
        }
      }

    }

    const newUrl = this.generateNewURL(url, searchParams);
    return newUrl;
  }

}