function addOneTimeEventListener(elem, eventName, callback) {
  async function modifiedCallback() {
    await callback();
    elem.removeEventListener(eventName, modifiedCallback);
  }

  elem.addEventListener(eventName, modifiedCallback);
}

export default addOneTimeEventListener;