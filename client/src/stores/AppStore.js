import { makeAutoObservable } from "mobx";

class AppStore {
  constructor() {
    this._darkBgVisible = false;
    this._isBlockedScroll = false;
    this._isGlobalLoading = false;
    this._isVisibleFiltersSidebar = false;
    this._isVisibleUsedFiltersSidebar = false;
    this._isVisibleCategoriesMenu = false;
    // some important app refs below to skip a big amount of props passing
    this._pageRef = null;
    this._deviceSectionRef = null;
    this._asideRef = null;
    this._headerRef = null;
    this._filtersShortcutRef = null;
    this._usedFiltersShortcutRef = null;
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

  setIsVisibleFiltersSidebar(bool) {
    this._isVisibleFiltersSidebar = bool;
  }

  setIsVisibleUsedFiltersSidebar(bool) {
    this._isVisibleUsedFiltersSidebar = bool;
  }
  setIsVisibleCategoriesMenu(bool) {
    this._isVisibleCategoriesMenu = bool;
  }

  setPageRef(ref) {
    this._pageRef = ref;
  }

  setDeviceSectionRef(ref) {
    this._deviceSectionRef = ref;
  }

  setAsideRef(ref) {
    this._asideRef = ref;
  }

  setHeaderRef(ref) {
    this._headerRef = ref;
  }

  setFiltersShortcutRef(ref) {
    this._filtersShortcutRef = ref;
  }

  setUsedFiltersShortcutRef(ref) {
    this._usedFiltersShortcutRef = ref;
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

  get isVisibleFiltersSidebar() {
    return this._isVisibleFiltersSidebar;
  }

  get isVisibleUsedFiltersSidebar() {
    return this._isVisibleUsedFiltersSidebar;
  }
  get isVisibleCategoriesMenu() {
    return this._isVisibleCategoriesMenu;
  }
  
  get pageRef() {
    return this._pageRef;
  }

  get deviceSectionRef() {
    return this._deviceSectionRef;
  }

  get asideRef() {
    return this._asideRef;
  }

  get headerRef() {
    return this._headerRef;
  }

  get filtersShortcutRef() {
    return this._filtersShortcutRef;
  }

  get usedFiltersShortcutRef() {
    return this._usedFiltersShortcutRef;
  }
}

export default AppStore;