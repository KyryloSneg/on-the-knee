import { makeAutoObservable } from "mobx";

class AppStore {
  constructor() {
    this._darkBgVisible = false;
    this._isBlockedScroll = false;
    this._isGlobalLoading = false;
    // some important app refs below to skip a big amount of props passing
    this._deviceSectionRef = null;
    this._asideBeginningRef = null;
    this._headerRef = null;
    makeAutoObservable(this);
  }

  setDarkBgVisible(bool) {
    this._darkBgVisible = bool;
  }

  setIsBlockedScroll(bool) {
    this._isBlockedScroll = bool;
  }

  setIsGlobalLoading(bool) {
    this._isGlobalLoading = bool;
  }

  setDeviceSectionRef(ref) {
    this._deviceSectionRef = ref;
  }

  setAsideBeginningRef(ref) {
    this._asideBeginningRef = ref;
  }

  setHeaderRef(ref) {
    this._headerRef = ref;
  }
  
  get darkBgVisible() {
    return this._darkBgVisible;
  }

  get isBlockedScroll() {
    return this._isBlockedScroll;
  }

  get isGlobalLoading() {
    return this._isGlobalLoading;
  }
  
  get deviceSectionRef() {
    return this._deviceSectionRef;
  }

  get asideBeginningRef() {
    return this._asideBeginningRef;
  }

  get headerRef() {
    return this._headerRef;
  }
}

export default AppStore;