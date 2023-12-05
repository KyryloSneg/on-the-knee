import _ from "lodash";
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
      // replacing percentage-decoded commas with normal ones to make the URL less ugly
      let queryParams = searchParams.toString().replaceAll("%2C", ",");
      // replacing spaces with underlines
      queryParams = queryParams.replaceAll("%20", "_");
      queryParams = queryParams.replaceAll("+", "_");

      newUrl = `${urlWithoutParams}?${queryParams}`;
    } else {
      newUrl = urlWithoutParams;
    }

    return decodeURI(encodeURI(newUrl));
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

    // replacing spaces in value with underlines to match it with url param values
    value = value.replaceAll(" ", "_");
    // almost redundant but i'll keep it here to reduce possible weird bugs in future
    value = value.replaceAll("+", "_");

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
    const decodedURL = decodeURIComponent(window.location.href);
    const url = new URL(decodedURL);
    const searchParams = new URLSearchParams(url.search);

    searchParams.set(name, value);
    searchParams.sort();

    const newUrl = this.generateNewURL(url, searchParams);
    return newUrl;
  }

  static getParamValue(name) {
    const decodedURL = decodeURIComponent(window.location.href);
    const url = new URL(decodedURL);
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
        filterValues.push(val.replaceAll("_", " "));
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

    if (Object.keys(filters).length) {
      for (let [key, values] of Object.entries(usedFilters)) {

        // idk how to separate the price filter from the other ones in this case
        if (SPECIAL_QUERY_PARAMS.includes(key) || key === "price") continue;

        // if the category filter that we used does not exist, delete it
        if (!filters[key]) {
          searchParams.delete(key);
          delete usedFilters[key];
          break;
        }

        // otherwise delete redundant values (repeating multiple times, incorrect ones etc.)
        values = values.filter(val => {
          const filter = filters[key].find(info => {
            const infoValue = key === "color" ? info.value.split("#")[0] : info.value;
            return infoValue === val;
          });

          return !!filter;
        });

        const uniqueValues = Array.from(new Set(values));
        const sortedUniqueValues = ArrayActions.sortStringArray(uniqueValues);

        if (!_.isEqual(usedFilters[key], sortedUniqueValues)) {
          // deleting a param related to the current used filter in the loop
          searchParams.delete(key);

          // making a new "value" for it without redundant filters
          const newValue = sortedUniqueValues.join(",");
          searchParams.set(key, newValue);

          usedFilters[key] = sortedUniqueValues;
        }

      }
    }

    const newUrl = this.generateNewURL(url, searchParams);
    return newUrl;
  }

}