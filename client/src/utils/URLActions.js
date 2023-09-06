import ArrayActions from "./ArrayActions";

export default class URLActions {

  static generateNewURL(url, searchParams) {
    const urlWithoutParams = url.origin + url.pathname;
    const newUrl = `${urlWithoutParams}?${searchParams.toString()}`;
    return newUrl;
  }

  static addParamValue(name, value) {
    const url = new URL(document.location.href);
    const searchParams = new URLSearchParams(url.search);
    const isNameAlreadyExists = searchParams.has(name);

    if (isNameAlreadyExists) {

      const paramPairs = Array.from(url.searchParams.entries());
      for (let [key, pairValue] of paramPairs) {
        if (key !== name) continue;
        // if a value was "apple" and new value is "orange" we'll get "apple%2Corange" param value
        const valueArray = [...pairValue.split("%2C"), value];
        const sortedValueArray = ArrayActions.sortStringArray(valueArray);
        const newValue = sortedValueArray.join("%2C");

        searchParams.set(key, newValue)
      }

    } else {
      searchParams.set(name, value);
      searchParams.sort();
    }

    const newUrl = this.generateNewURL(url, searchParams);
    return newUrl;
  }

  static setNewParam(name, value) {
    const url = new URL(document.location.href);
    const searchParams = new URLSearchParams(url.search);

    searchParams.set(name, value);
    searchParams.sort();

    const newUrl = this.generateNewURL(url, searchParams);
    return newUrl;
  }

  static getParamValue(name) {
    const url = new URL(document.location.href);
    const searchParams = new URLSearchParams(url.search);

    const value = searchParams.get(name);
    return value;
  }

}