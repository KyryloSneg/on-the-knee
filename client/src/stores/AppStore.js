import { makeAutoObservable } from "mobx";

class AppStore {
  constructor() {
    this._darkBgVisible = false;
    this._isBlockedScroll = false;
    this._isGlobalLoading = false;
    this._modalVisible = false;

    this._isVisibleMenu = false;
    this._isVisibleFiltersSidebar = false;
    this._isVisibleUsedFiltersSidebar = false;
    this._isVisibleCategoriesMenu = false;
    this._isVisibleCategoriesModal = false;
    this._isVisibleUserLocationModal = false;
    this._isVisibleSelfDeliveryModal = false;
    this._isVisibleDeviceFeedbackModal = false;
    this._isVisibleReplyModal = false;
    this._isVisibleQuestionCommentModal = false;
    this._isVisibleAnswerModal = false;
    this._isVisibleCommentGalleryModal = false;
    this._isFocusedSearchForm = false;

    this._hintSearchResults = []
    // some important app refs below are used to skip a big amount of props passing
    this._pageRef = null;
    this._deviceSectionRef = null;
    this._filtersAsideRef = null;
    this._headerRef = null;
    this._menuShortcutRef = null;
    this._filtersShortcutRef = null;
    this._usedFiltersShortcutRef = null;
    this._navBtnGroupRef = null;

    this._userLocation = null;
    this._allLocations = [];
    this._isToShowUserLocationNotification = false;
    this._isUserLocationDeterminedCorrectly = true;

    // we moved states below from DevicePage to reload them on creating a feedback or a question
    this._deviceFeedbacks = [];
    this._deviceQuestions = [];

    // we use these states in modals that are related to the info below
    this._selectedDeviceId = null;
    this._selectedDeviceFeedbackId = null;
    this._selectedDeviceQuestionId = null;
    this._commentGalleryModalType = "deviceFeedbacks";
    this._commentGallerySelectedImageId = null;

    this._storePickupPoints = [];
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

  setModalVisible(bool) {
    this._modalVisible = bool;
  }

  setIsVisibleFiltersSidebar(bool) {
    this._isVisibleFiltersSidebar = bool;
  }

  setIsVisibleMenu(bool) {
    this._isVisibleMenu = bool;
  }

  setIsVisibleUsedFiltersSidebar(bool) {
    this._isVisibleUsedFiltersSidebar = bool;
  }

  setIsVisibleCategoriesMenu(bool) {
    this._isVisibleCategoriesMenu = bool;
  }

  setIsVisibleCategoriesModal(bool) {
    this._isVisibleCategoriesModal = bool;
  }

  setIsVisibleUserLocationModal(bool) {
    this._isVisibleUserLocationModal = bool;
  }

  setIsVisibleSelfDeliveryModal(bool) {
    this._isVisibleSelfDeliveryModal = bool;
  }

  setIsVisibleDeviceFeedbackModal(bool) {
    this._isVisibleDeviceFeedbackModal = bool;
  }

  setIsVisibleReplyModal(bool) {
    this._isVisibleReplyModal = bool;
  }

  setIsVisibleQuestionCommentModal(bool) {
    this._isVisibleQuestionCommentModal = bool;
  }

  setIsVisibleAnswerModal(bool) {
    this._isVisibleAnswerModal = bool;
  }

  setIsVisibleCommentGalleryModal(bool) {
    this._isVisibleCommentGalleryModal = bool;
  }

  setIsFocusedSearchForm(bool) {
    this._isFocusedSearchForm = bool;
  }

  setPageRef(ref) {
    this._pageRef = ref;
  }

  setDeviceSectionRef(ref) {
    this._deviceSectionRef = ref;
  }

  setFiltersAsideRef(ref) {
    this._filtersAsideRef = ref;
  }

  setHeaderRef(ref) {
    this._headerRef = ref;
  }

  setMenuShortcutRef(ref) {
    this._menuShortcutRef = ref;
  }

  setFiltersShortcutRef(ref) {
    this._filtersShortcutRef = ref;
  }

  setUsedFiltersShortcutRef(ref) {
    this._usedFiltersShortcutRef = ref;
  }

  setNavBtnGroupRef(ref) {
    this._navBtnGroupRef = ref;
  }

  setHintSearchResults(results) {
    this._hintSearchResults = results;
  }

  setUserLocation(userLocation) {
    this._userLocation = userLocation;
  }
  
  setAllLocations(allLocations) {
    this._allLocations = allLocations;
  }

  setIsToShowUserLocationNotification(isToShowUserLocationNotification) {
    this._isToShowUserLocationNotification = isToShowUserLocationNotification;
  }

  setIsUserLocationDeterminedCorrectly(isUserLocationDeterminedCorrectly) {
    this._isUserLocationDeterminedCorrectly = isUserLocationDeterminedCorrectly;
  }

  setDeviceFeedbacks(deviceFeedbacks) {
    this._deviceFeedbacks = deviceFeedbacks;
  }

  setDeviceQuestions(deviceQuestions) {
    this._deviceQuestions = deviceQuestions;
  }

  setSelectedDeviceId(selectedDeviceId) {
    this._selectedDeviceId = selectedDeviceId;
  }
  
  setSelectedDeviceFeedbackId(selectedDeviceFeedbackId) {
    this._selectedDeviceFeedbackId = selectedDeviceFeedbackId;
  }

  setSelectedDeviceQuestionId(selectedDeviceQuestionId) {
    this._selectedDeviceQuestionId = selectedDeviceQuestionId;
  }

  setCommentGalleryModalType(commentGalleryModalType) {
    this._commentGalleryModalType = commentGalleryModalType;
  }

  setCommentGallerySelectedImageId(commentGallerySelectedImageId) {
    this._commentGallerySelectedImageId = commentGallerySelectedImageId;
  }

  setStorePickupPoints(storePickupPoints) {
    this._storePickupPoints = storePickupPoints;
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

  get modalVisible() {
    return this._modalVisible;
  }

  get isVisibleMenu() {
    return this._isVisibleMenu;
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

  get isVisibleCategoriesModal() {
    return this._isVisibleCategoriesModal;
  }

  get isVisibleUserLocationModal() {
    return this._isVisibleUserLocationModal;
  }

  get isVisibleSelfDeliveryModal() {
    return this._isVisibleSelfDeliveryModal;
  }

  get isVisibleDeviceFeedbackModal() {
    return this._isVisibleDeviceFeedbackModal;
  }

  get isVisibleReplyModal() {
    return this._isVisibleReplyModal;
  }

  get isVisibleQuestionCommentModal() {
    return this._isVisibleQuestionCommentModal;
  }

  get isVisibleAnswerModal() {
    return this._isVisibleAnswerModal;
  }

  get isVisibleCommentGalleryModal() {
    return this._isVisibleCommentGalleryModal;
  }

  get isFocusedSearchForm() {
    return this._isFocusedSearchForm;
  }
  
  get pageRef() {
    return this._pageRef;
  }

  get deviceSectionRef() {
    return this._deviceSectionRef;
  }

  get filtersAsideRef() {
    return this._filtersAsideRef;
  }

  get headerRef() {
    return this._headerRef;
  }

  get menuShortcutRef() {
    return this._menuShortcutRef;
  }

  get filtersShortcutRef() {
    return this._filtersShortcutRef;
  }

  get usedFiltersShortcutRef() {
    return this._usedFiltersShortcutRef;
  }

  get navBtnGroupRef() {
    return this._navBtnGroupRef;
  }

  get hintSearchResults() {
    return this._hintSearchResults;
  }

  get userLocation() {
    return this._userLocation;
  }

  get allLocations() {
    return this._allLocations;
  }

  get isToShowUserLocationNotification() {
    return this._isToShowUserLocationNotification;
  }

  get isUserLocationDeterminedCorrectly() {
    return this._isUserLocationDeterminedCorrectly;
  }

  get deviceFeedbacks() {
    return this._deviceFeedbacks;
  }

  get deviceQuestions() {
    return this._deviceQuestions;
  }

  get selectedDeviceId() {
    return this._selectedDeviceId;
  }

  get selectedDeviceFeedbackId() {
    return this._selectedDeviceFeedbackId;
  }

  get selectedDeviceQuestionId() {
    return this._selectedDeviceQuestionId;
  }

  get commentGalleryModalType() {
    return this._commentGalleryModalType;
  }

  get commentGallerySelectedImageId() {
    return this._commentGallerySelectedImageId;
  }

  get storePickupPoints() {
    return this._storePickupPoints;
  }
}

export default AppStore;