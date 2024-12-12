import _ from "lodash";
import ArrayActions from "./ArrayActions";
import { SPECIAL_QUERY_PARAMS, SPECIAL_TO_HANDLE_FILTERS } from "./consts";

export default class URLActions {

  static generateNewURL(url, searchParams) {
    const urlWithoutParams = url.origin + url.pathname;
    let newUrl;

    if (searchParams.toString()) {
      let queryParams = searchParams.toString().replaceAll("%2C", ",");
      newUrl = `${urlWithoutParams}?${queryParams}`;
    } else {
      newUrl = urlWithoutParams;
    }

    return newUrl;
  }

  static addParamValue(name, value, href = window.location.href) {
    const url = new URL(href);
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
        const encodedSortedValueArray = sortedValueArray.map(val => (val?.replaceAll(",", "%2C") || value))
        const newValue = encodedSortedValueArray.join(",");

        searchParams.set(key, newValue)
      }

    } else {
      searchParams.set(name, (typeof value === "string" ? value.replaceAll(",", "%2C") : value));
      searchParams.sort();
    }

    const newUrl = this.generateNewURL(url, searchParams);
    return newUrl;
  }

  static deleteParamValue(name, value, href = window.location.href) {
    const url = new URL(href);
    const searchParams = new URLSearchParams(url.search);

    const isMultipleValues = searchParams.get(name)?.split(",").length > 1;
    if (isMultipleValues && value) {
      const paramValue = searchParams.get(name);
      // in paramValue we have comma encoded as %2C, not %252C as in URL
      const valueWithEncodedComma = value.replaceAll(",", "%2C");
      const strToReplace = paramValue.startsWith(valueWithEncodedComma) 
        ? `${valueWithEncodedComma},` 
        : `,${valueWithEncodedComma}`;

      // if a value was "apple,orange" and value to delete is "orange" we'll get "apple" param value
      const newValue = paramValue.replace(strToReplace, "");
      searchParams.set(name, newValue);
    } else {
      searchParams.delete(name);
    }

    const newUrl = this.generateNewURL(url, searchParams);
    return newUrl;
  }

  static deleteAllDefaultParamValues(href = window.location.href) {
    const url = new URL(href);
    const searchParams = new URLSearchParams(url.search);
    const paramPairs = Array.from(url.searchParams.entries());

    for (let [key] of paramPairs) {
      if (SPECIAL_QUERY_PARAMS.includes(key)) continue;
      searchParams.delete(key);
    }

    const newUrl = this.generateNewURL(url, searchParams);
    return newUrl;
  }

  static setNewParam(name, value, href = window.location.href) {
    const url = new URL(href);
    const searchParams = new URLSearchParams(url.search);

    searchParams.set(name, typeof value === "string" ? value?.replaceAll(",", "%2C") : value);
    searchParams.sort();

    const newUrl = this.generateNewURL(url, searchParams);
    return newUrl;
  }

  static getParamValue(name, href = window.location.href) {
    const decodedURL = decodeURIComponent(href);
    const url = new URL(decodedURL);
    const searchParams = new URLSearchParams(url.search);

    const value = searchParams.get(name);
    return value;
  }

  static getUsedFilters(filters, href = window.location.href) {
    const url = new URL(href);
    const searchParams = new URLSearchParams(url.search);

    let usedFilters = {};
    for (let [key, value] of searchParams.entries()) {
      if (SPECIAL_QUERY_PARAMS.includes(key)) continue;

      let filterValues = [];
      for (let val of value.split(",")) {
        filterValues.push(val.replaceAll("%252C", ",").replaceAll("%2C", ","));
      }

      usedFilters[key] = filterValues;
    }
    
    const newUrl = this.deleteAllRedundantFilters(filters, usedFilters);
    return { usedFilters, url: newUrl };
  }

  static deleteAllRedundantFilters(filters, usedFilters, href = window.location.href) {
    const url = new URL(href);
    const searchParams = new URLSearchParams(url.search);

    if (Object.keys(filters).length) {
      for (let [key, values] of Object.entries(usedFilters)) {

        // idk how to separate the price filter from the other ones in this case
        if (SPECIAL_QUERY_PARAMS.includes(key) || key === "price") continue;

        // if the category filter that we used does not exist, delete it
        if (!filters[key] && SPECIAL_TO_HANDLE_FILTERS.includes(key)) {
          continue;
        } else if (!filters[key]) {
          searchParams.delete(key);
          delete usedFilters[key];
          break;
        }

        // otherwise delete redundant values (repeating multiple times, incorrect ones etc.)
        values = values.filter(val => {
          const filter = filters[key].find(info => {
            const infoValue = key === "color" ? info.value.split("_")[0] : info.value;
            return infoValue === val;
          });

          return !!filter;
        });

        if (!values.length) {
          searchParams.delete(key);
          delete usedFilters[key];
          break;
        }

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

  static getURLWithResettedPageRelatedParams(href = window.location.href) {
    let result = this.setNewParam("page", "1", href);
    result = this.setNewParam("pagesToFetch", "1", result);

    return result;
  }

}