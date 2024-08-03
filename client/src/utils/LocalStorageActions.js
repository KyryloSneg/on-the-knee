class LocalStorageActions {

  /**
   * Getting localStorage item with fallback value on error.
   * @param {string} name - The name of the item.
   * @param {boolean} isToDeleteOnSyntaxError - is to delete item if json syntax error has been throwed.
   */
  static getItem(name, isToDeleteOnSyntaxError = true, isJSON = true) {
    let item;

    try {
      item = localStorage.getItem(name);
      if (isJSON) item = JSON.parse(item);
    } catch (e) {
      if (e.name === "SyntaxError") {
        if (isToDeleteOnSyntaxError) localStorage.removeItem(name);
      };
    }

    return item;
  }

};

export default LocalStorageActions;