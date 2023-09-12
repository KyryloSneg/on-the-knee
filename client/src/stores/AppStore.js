import { makeAutoObservable } from "mobx";

class AppStore {
  constructor() {
    this._darkBgVisible = false;
    this._isBlockedScroll = false;
    // some important app refs below to skip a big amount of props passing
    this._deviceSectionRef = null;
    this._asideBeginningRef = null;
    makeAutoObservable(this);
  }

  setDarkBgVisible(bool) {
    this._darkBgVisible = bool;
  }

  setIsBlockedScroll(bool) {
    this._isBlockedScroll = bool;
  }

  setDeviceSectionRef(ref) {
    this._deviceSectionRef = ref;
  }

  setAsideBeginningRef(ref) {
    this._asideBeginningRef = ref;
  }
  
  get darkBgVisible() {
    return this._darkBgVisible;
  }

  get isBlockedScroll() {
    return this._isBlockedScroll;
  }

  get deviceSectionRef() {
    return this._deviceSectionRef;
  }

  get asideBeginningRef() {
    return this._asideBeginningRef;
  }
}

export default AppStore;